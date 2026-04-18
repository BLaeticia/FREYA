const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || 'votre_cle_secrete', { expiresIn: '24h' });

// ─── REGISTER PATIENT ─────────────────────────────────────────────────────────
router.post('/register/patient', async (req, res) => {
  try {
    const { email, phone, firstName, lastName, password, birthDate, gender, wilaya } = req.body;

    if (!password || !firstName || !lastName)
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });

    const existing = await prisma.user.findFirst({
      where: { OR: [email ? { email } : null, phone ? { phone } : null].filter(Boolean) }
    });
    if (existing) return res.status(409).json({ error: 'Email ou téléphone déjà utilisé.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        firstName,
        lastName,
        password: hashed,
        role: 'patient',
        isActive: true,
        isVerified: true,
        patientProfile: { create: {} }
      }
    });

    const token = signToken(user.id, user.role);
    const { password: _, ...userData } = user;
    res.status(201).json({ token, user: userData });
  } catch (error) {
    console.error('Erreur Register Patient:', error);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// ─── REGISTER DOCTOR ──────────────────────────────────────────────────────────
router.post('/register/doctor', async (req, res) => {
  try {
    const { email, phone, firstName, lastName, password, specialite, ordreNumber, wilaya, city, cabinetAddress, consultationPrice, bio } = req.body;

    if (!password || !firstName || !lastName || !specialite || !ordreNumber)
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });

    const existing = await prisma.user.findFirst({
      where: { OR: [email ? { email } : null, phone ? { phone } : null].filter(Boolean) }
    });
    if (existing) return res.status(409).json({ error: 'Email ou téléphone déjà utilisé.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        firstName,
        lastName,
        password: hashed,
        role: 'doctor',
        isActive: true,
        doctor: {
          create: { specialite, ordreNumber, wilaya, city, cabinetAddress, consultationPrice: consultationPrice || 2000, bio }
        }
      }
    });

    const token = signToken(user.id, user.role);
    const { password: _, ...userData } = user;
    res.status(201).json({ token, user: userData });
  } catch (error) {
    console.error('Erreur Register Doctor:', error);
    res.status(500).json({ error: "Erreur lors de l'inscription." });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { OR: [email ? { email } : null, phone ? { phone } : null].filter(Boolean) }
    });

    if (!user) return res.status(401).json({ error: 'Identifiants incorrects.' });
    if (!user.isActive) return res.status(403).json({ error: 'Compte désactivé.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Identifiants incorrects.' });

    if (user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: user.id }, select: { adminApproved: true } });
      if (!doctor?.adminApproved) return res.status(403).json({ error: 'Compte en attente de validation.' });
    }

    const token = signToken(user.id, user.role);
    const { password: _, ...userData } = user;
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Erreur Login:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── GET ME ───────────────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token manquant.' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_cle_secrete');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, email: true, role: true, firstName: true, lastName: true,
        phone: true, wilaya: true, avatar: true, isActive: true, createdAt: true,
        patientProfile: true,
        doctor: true,
      }
    });

    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Token invalide.' });
  }
});

module.exports = router;