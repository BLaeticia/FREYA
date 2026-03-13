const prisma = require('../prisma/client');

// ─── Ajouter un avis ──────────────────────────────────────────────────────────
const addReview = async (patientId, { doctorId, appointmentId, rating, comment, isAnonymous }) => {
  if (rating < 1 || rating > 5) throw { status: 400, message: 'La note doit être entre 1 et 5.' };

  const appt = await prisma.appointment.findFirst({ where: { id: appointmentId, patientId, status: 'completed' } });
  if (!appt) throw { status: 403, message: 'Vous ne pouvez noter qu\'un rendez-vous terminé.' };

  const review = await prisma.review.create({
    data: { doctorId, patientId, appointmentId, rating, comment, isAnonymous: !!isAnonymous }
  });

  // Recalculer la note moyenne du médecin
  const { _avg, _count } = await prisma.review.aggregate({ where: { doctorId }, _avg: { rating: true }, _count: true });
  await prisma.doctor.update({
    where: { id: doctorId },
    data: { ratingAvg: Math.round((_avg.rating || 0) * 10) / 10, ratingCount: _count }
  });

  return { message: 'Avis publié. Merci !', reviewId: review.id };
};

// ─── Avis d'un médecin ────────────────────────────────────────────────────────
const getDoctorReviews = async (doctorId) => {
  const [reviews, doctor] = await Promise.all([
    prisma.review.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' },
      include: { patient: { select: { firstName: true, lastName: true } } }
    }),
    prisma.doctor.findUnique({ where: { id: doctorId }, select: { ratingAvg: true, ratingCount: true } })
  ]);

  // Masquer le nom si anonyme
  const sanitized = reviews.map(r => ({
    ...r,
    patient: r.isAnonymous ? { firstName: 'Anonyme', lastName: '' } : r.patient
  }));

  return { reviews: sanitized, summary: doctor };
};

module.exports = { addReview, getDoctorReviews };