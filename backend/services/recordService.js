const prisma = require('../prisma/client');

// ─── Dossiers médicaux d'un patient ──────────────────────────────────────────
const getRecords = async (user, patientId) => {
  const targetId = user.role === 'patient' ? user.id : patientId;
  if (!targetId) throw { status: 400, message: 'patient_id requis.' };

  // Un médecin ne peut voir les dossiers que s'il a eu un RDV avec le patient
  if (user.role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id }, select: { id: true } });
    const hasAccess = await prisma.appointment.findFirst({ where: { doctorId: doctor.id, patientId: targetId } });
    if (!hasAccess) throw { status: 403, message: 'Accès refusé. Aucun dossier partagé.' };
  }

  const [records, profile, patient] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: { patientId: targetId },
      orderBy: { createdAt: 'desc' },
      include: { doctor: { include: { user: { select: { firstName: true, lastName: true } } } } }
    }),
    prisma.patientProfile.findUnique({ where: { userId: targetId } }),
    prisma.user.findUnique({ where: { id: targetId }, select: { firstName: true, lastName: true, phone: true, wilaya: true } })
  ]);

  return { records, profile, patient };
};

// ─── Ajouter un document médical (médecin seulement) ─────────────────────────
const addRecord = async (userId, { patientId, appointmentId, recordType, title, description, diagnosis, prescription }) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { id: true } });
  if (!doctor) throw { status: 404, message: 'Profil médecin introuvable.' };

  const record = await prisma.medicalRecord.create({
    data: { patientId, doctorId: doctor.id, appointmentId: appointmentId || null, recordType, title, description, diagnosis, prescription }
  });

  await prisma.notification.create({
    data: { userId: patientId, type: 'new_record', title: 'Nouveau document médical', body: `Votre médecin a ajouté : ${title}` }
  });

  return { message: 'Document ajouté au dossier patient.', recordId: record.id };
};

// ─── Profil santé patient ─────────────────────────────────────────────────────
const getProfile = async (userId) => {
  return prisma.patientProfile.findUnique({ where: { userId } });
};

const updateProfile = async (userId, data) => {
  await prisma.patientProfile.update({ where: { userId }, data });
  return { message: 'Profil de santé mis à jour.' };
};

module.exports = { getRecords, addRecord, getProfile, updateProfile };