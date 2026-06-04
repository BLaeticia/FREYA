const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');


// ─── INSCRIPTION ───
router.post(['/register', '/register/patient'], async (req, res) => {
  try {
    const { email, phone, firstName, lastName, password, role } = req.body;

    const conditions = [];
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    if (conditions.length === 0) {
      return res.status(400).json({ error: "Email ou téléphone requis." });
    }

    const existingUser = await prisma.user.findFirst({ where: { OR: conditions } });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email ou numéro de téléphone est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        firstName,
        lastName,
        password: hashedPassword,
        role: role || 'patient',
        isActive: true,
        isVerified: false,
        patientProfile: (role === 'patient' || !role) ? { create: {} } : undefined,
      }
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'registration',
        title: 'Bienvenue sur Freya !',
        body: `Bonjour ${firstName}, votre compte est créé avec succès.`,
      }
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", userId: user.id });
  } catch (error) {
    console.error("Erreur Register:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// ─── CONNEXION ───
router.post('/login', async (req, res) => {
  try {
    const { email: rawEmail, phone: rawPhone, password } = req.body;
    const email = rawEmail?.trim() || null;
    const phone = rawPhone?.trim() || null;
    console.log(`[LOGIN] email="${email}" phone="${phone}" password="${password ? '***' : 'VIDE'}"`);

    if (!email && !phone) {
      return res.status(400).json({ error: "Email ou téléphone requis." });
    }

    // $queryRaw — bypass de la validation enum Prisma pour supporter tous les rôles
    let rows;
    if (email) {
      rows = await prisma.$queryRaw`
        SELECT id, email, phone, role, "firstName", last_name AS "lastName",
               password, is_active AS "isActive", is_verified AS "isVerified",
               wilaya, clinic_id AS "clinicId"
        FROM users WHERE email = ${email} LIMIT 1
      `;
    } else {
      rows = await prisma.$queryRaw`
        SELECT id, email, phone, role, "firstName", last_name AS "lastName",
               password, is_active AS "isActive", is_verified AS "isVerified",
               wilaya, clinic_id AS "clinicId"
        FROM users WHERE phone = ${phone} LIMIT 1
      `;
    }

    const user = rows?.[0];
    if (!user) {
      console.log('[LOGIN] 401 - utilisateur non trouvé');
      return res.status(401).json({ error: "Identifiants incorrects." });
    }
    if (!user.isActive) return res.status(403).json({ error: "Compte désactivé." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('[LOGIN] 401 - mauvais mot de passe pour:', email || phone);
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    if (user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
        select: { adminApproved: true }
      });
      if (!doctor?.adminApproved) {
        return res.status(403).json({ error: "Votre compte médecin est en attente de validation par l'administrateur." });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete',
      { expiresIn: process.env.JWT_EXPIRATION_IN || '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    console.log('[LOGIN] 200 OK - rôle:', user.role);
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// ─── ROUTES PROTÉGÉES ───
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);
router.put('/password', auth, authController.changePassword);

module.exports = router;
