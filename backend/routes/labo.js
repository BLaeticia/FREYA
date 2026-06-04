// routes/labo.js — Espace professionnel laboratoire
const router  = require('express').Router();
const prisma  = require('../prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const { addLabResult } = require('../services/recordService');
const { getMyAppointments, updateStatus } = require('../services/appointmentService');

const labAuth = [auth, requireRole('laboratory')];

// ─── Profil du laboratoire ────────────────────────────────────────────────────
router.get('/profile', ...labAuth, async (req, res) => {
  try {
    if (!req.user.clinicId) return res.status(404).json({ error: 'Laboratoire non associé.' });
    const clinic = await prisma.clinic.findUnique({ where: { id: req.user.clinicId } });
    if (!clinic) return res.status(404).json({ error: 'Laboratoire introuvable.' });
    res.json(clinic);
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

router.put('/profile', ...labAuth, async (req, res) => {
  try {
    const { name, address, phone, email, description, specialites } = req.body;
    if (!req.user.clinicId) return res.status(404).json({ error: 'Laboratoire non associé.' });
    const updated = await prisma.clinic.update({
      where: { id: req.user.clinicId },
      data: {
        ...(name        !== undefined && { name }),
        ...(address     !== undefined && { address }),
        ...(phone       !== undefined && { phone }),
        ...(email       !== undefined && { email }),
        ...(description !== undefined && { description }),
        ...(specialites !== undefined && { specialites }),
      },
    });
    res.json({ message: 'Profil mis à jour.', clinic: updated });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Stats tableau de bord ────────────────────────────────────────────────────
router.get('/stats', ...labAuth, async (req, res) => {
  try {
    if (!req.user.clinicId) return res.json({ appointments: 0, analysesCount: 0, ratingAvg: 0 });
    const [apptTotal, apptPending, clinic] = await Promise.all([
      prisma.appointment.count({ where: { clinicId: req.user.clinicId } }),
      prisma.appointment.count({ where: { clinicId: req.user.clinicId, status: { in: ['pending', 'confirmed'] } } }),
      prisma.clinic.findUnique({ where: { id: req.user.clinicId }, select: { specialites: true, ratingAvg: true, ratingCount: true, name: true, wilaya: true } }),
    ]);
    res.json({
      appointments: apptTotal,
      pending: apptPending,
      analysesCount: clinic?.specialites ? clinic.specialites.split(',').filter(s => s.trim()).length : 0,
      ratingAvg: clinic?.ratingAvg || 0,
      ratingCount: clinic?.ratingCount || 0,
      wilaya: clinic?.wilaya || '—',
      name: clinic?.name || '—',
    });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Rendez-vous du laboratoire ───────────────────────────────────────────────
router.get('/appointments', ...labAuth, async (req, res) => {
  try {
    const appts = await getMyAppointments(req.user, { limit: 200 });
    res.json(appts);
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

router.patch('/appointments/:id/status', ...labAuth, async (req, res) => {
  try {
    res.json(await updateStatus(req.params.id, req.body, req.user));
  } catch (err) { res.status(err.status || 500).json({ error: err.message || 'Erreur serveur.' }); }
});

// ─── Envoyer des résultats d'analyses ────────────────────────────────────────
router.post('/results', ...labAuth, async (req, res) => {
  try {
    if (!req.user.clinicId) return res.status(403).json({ error: 'Laboratoire non associé.' });
    res.status(201).json(await addLabResult(req.user.clinicId, req.body));
  } catch (err) { res.status(err.status || 500).json({ error: err.message || 'Erreur serveur.' }); }
});

// ─── Analyses (depuis specialites) ───────────────────────────────────────────
router.get('/analyses', ...labAuth, async (req, res) => {
  try {
    if (!req.user.clinicId) return res.json([]);
    const clinic = await prisma.clinic.findUnique({ where: { id: req.user.clinicId }, select: { specialites: true } });
    const list = clinic?.specialites
      ? clinic.specialites.split(',').map((s, i) => ({ id: i, name: s.trim() })).filter(s => s.name)
      : [];
    res.json(list);
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

module.exports = router;
