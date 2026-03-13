const prisma = require('../prisma/client');

// ─── Prendre un RDV ───────────────────────────────────────────────────────────
const bookAppointment = async (patientId, { doctorId, appointmentDate, appointmentTime, motif, isFirstVisit }) => {
  const doctor = await prisma.doctor.findFirst({ where: { id: doctorId, adminApproved: true } });
  if (!doctor) throw { status: 404, message: 'Médecin introuvable.' };

  const appointment = await prisma.appointment.create({
    data: { doctorId, patientId, appointmentDate: new Date(appointmentDate), appointmentTime, motif, isFirstVisit: !!isFirstVisit }
  });

  // Notification au médecin
  const patient = await prisma.user.findUnique({ where: { id: patientId }, select: { firstName: true, lastName: true } });
  const docUser = await prisma.user.findFirst({ where: { doctor: { id: doctorId } }, select: { id: true } });
  await prisma.notification.create({
    data: { userId: docUser.id, type: 'new_appointment', title: 'Nouveau rendez-vous', body: `${patient.firstName} ${patient.lastName} — ${appointmentDate} à ${appointmentTime}`, data: { appointmentId: appointment.id } }
  });

  return { message: 'Rendez-vous créé avec succès.', appointmentId: appointment.id };
};

// ─── Mes rendez-vous ──────────────────────────────────────────────────────────
const getMyAppointments = async (user, { status, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  if (user.role === 'patient') {
    return prisma.appointment.findMany({
      where: { patientId: user.id, ...where },
      skip, take: parseInt(limit),
      orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'desc' }],
      include: { doctor: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } } }
    });
  }

  // Doctor
  const doctor = await prisma.doctor.findUnique({ where: { userId: user.id }, select: { id: true } });
  return prisma.appointment.findMany({
    where: { doctorId: doctor.id, ...where },
    skip, take: parseInt(limit),
    orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'desc' }],
    include: { patient: { select: { firstName: true, lastName: true, phone: true, avatar: true } } }
  });
};

// ─── Détail d'un RDV ──────────────────────────────────────────────────────────
const getAppointmentById = async (id) => {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: {
      doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
      patient: { select: { firstName: true, lastName: true, phone: true } },
    }
  });
  if (!appt) throw { status: 404, message: 'Rendez-vous introuvable.' };
  return appt;
};

// ─── Changer le statut d'un RDV ──────────────────────────────────────────────
const updateStatus = async (id, { status, notes }, user) => {
  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt) throw { status: 404, message: 'Rendez-vous introuvable.' };

  // Vérifier les permissions
  if (user.role === 'patient' && appt.patientId !== user.id)
    throw { status: 403, message: 'Accès refusé.' };

  if (user.role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (appt.doctorId !== doctor.id) throw { status: 403, message: 'Accès refusé.' };
  }

  await prisma.appointment.update({ where: { id }, data: { status, notes } });

  // Notification à l'autre partie
  const labels = { confirmed: 'confirmé', cancelled: 'annulé', completed: 'terminé' };
  const docUser = await prisma.user.findFirst({ where: { doctor: { id: appt.doctorId } }, select: { id: true } });
  const recipientId = user.role === 'doctor' ? appt.patientId : docUser.id;

  await prisma.notification.create({
    data: { userId: recipientId, type: 'appointment_update', title: `Rendez-vous ${labels[status] || status}`, body: `Votre rendez-vous du ${appt.appointmentDate.toISOString().split('T')[0]} à ${appt.appointmentTime} a été ${labels[status] || status}.` }
  });

  return { message: `Rendez-vous ${status} avec succès.` };
};

module.exports = { bookAppointment, getMyAppointments, getAppointmentById, updateStatus };