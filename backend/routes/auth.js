const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

<<<<<<< HEAD
// ─── INSCRIPTION (Register) ───
<<<<<<< HEAD
// ─── INSCRIPTION (Register) ───
router.post('/register', async (req, res) => {
=======
=======
// ─── INSCRIPTION ───
>>>>>>> c514d174f3420419375be94dd4c231ca1414b12f
router.post(['/register', '/register/patient'], async (req, res) => {
>>>>>>> 46c9b642d471240671036c70042eb1f14e89cc38
  try {
    const { email, phone, firstName, lastName, password, role } = req.body;

<<<<<<< HEAD
    // ... (ton code de vérification d'existant reste le même)

=======
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ].filter(Boolean)
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Cet email ou numéro de téléphone est déjà utilisé." });
    }

>>>>>>> c514d174f3420419375be94dd4c231ca1414b12f
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
<<<<<<< HEAD
<<<<<<< HEAD
        password: hashedPassword,
        firstName: firstName,   // Changé de first_name à firstName
        lastName: lastName,     // Changé de last_name à lastName
       birth_date: new Date(birthDate),  // Changé de birth_date à birthDate
        gender: gender,
        role: role || 'patient'
=======
        firstName: firstName,
        lastName: lastName,
=======
        firstName,
        lastName,
>>>>>>> c514d174f3420419375be94dd4c231ca1414b12f
        password: hashedPassword,
        role: role || 'patient',
        isActive: true,
        isVerified: false
>>>>>>> 46c9b642d471240671036c70042eb1f14e89cc38
      }
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'registration',
        title: 'Bienvenue sur Freya ! 🎉',
        body: `Bonjour ${firstName}, votre compte patient est créé avec succès.`,
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
    const { email, phone, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ].filter(Boolean)
      }
    });

    if (!user) return res.status(401).json({ error: "Identifiants incorrects." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Identifiants incorrects." });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;