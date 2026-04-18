const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// ─── INSCRIPTION ───
router.post(['/register', '/register/patient'], async (req, res) => {
  try {
    const { email, phone, firstName, lastName, password, role } = req.body;

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
        isVerified: false
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