const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// ─── INSCRIPTION (Register) ───
// ─── INSCRIPTION (Register) ───
router.post('/register', async (req, res) => {
  try {
    const { email, phone, firstName, lastName, password, birthDate, gender, role } = req.body;

    // ... (ton code de vérification d'existant reste le même)

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        firstName: firstName,   // Changé de first_name à firstName
        lastName: lastName,     // Changé de last_name à lastName
       birth_date: new Date(birthDate),  // Changé de birth_date à birthDate
        gender: gender,
        role: role || 'patient'
      }
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", userId: user.id });
  } catch (error) {
    console.error("Erreur Register:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// ─── CONNEXION (Login) ───
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

    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete',
      { expiresIn: '24h' }
    );

    // On ne renvoie pas le password au frontend
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;