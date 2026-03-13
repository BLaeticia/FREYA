const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 Seeding Freya...\n');

  // Nettoyage
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();

  const hash = (pw) => bcrypt.hash(pw, 12);

  // Admin
  await prisma.user.create({
    data: { email: 'admin@freya.dz', password: await hash('admin123'), role: 'admin', firstName: 'Admin', lastName: 'Freya', isActive: true, isVerified: true }
  });

  // Patients
  const patients = await Promise.all([
    prisma.user.create({ data: { email: 'patient@freya.dz', password: await hash('password123'), role: 'patient', firstName: 'Mohamed', lastName: 'Bensalem', phone: '0661234567', wilaya: 'Alger', isActive: true, isVerified: true, patientProfile: { create: { bloodType: 'A+', gender: 'male', dateOfBirth: new Date('1980-03-15'), height: 175, weight: 82, chronicDiseases: 'Hypertension, Diabète type 2', emergencyContactName: 'Fatima Bensalem', emergencyContactPhone: '0551234567' } } } }),
    prisma.user.create({ data: { email: 'samira@freya.dz',  password: await hash('password123'), role: 'patient', firstName: 'Samira',  lastName: 'Larbi',    phone: '0771234567', wilaya: 'Alger', isActive: true, isVerified: true, patientProfile: { create: { bloodType: 'O+', gender: 'female', dateOfBirth: new Date('1992-07-22') } } } }),
    prisma.user.create({ data: { email: 'djamel@freya.dz',  password: await hash('password123'), role: 'patient', firstName: 'Djamel',  lastName: 'Hamdi',    phone: '0551234567', wilaya: 'Oran',  isActive: true, isVerified: true, patientProfile: { create: { bloodType: 'B-', gender: 'male',   dateOfBirth: new Date('1967-11-03') } } } }),
  ]);

  // Médecins
  const doctorsData = [
    { email: 'dr.benali@freya.dz',   fn: 'Karim',   ln: 'Benali',    spec: 'Cardiologue',         ordre: 'ALG-CARD-2015-001', wilaya: 'Alger',       city: 'Hydra',      price: 3000, exp: 15, rating: 4.9, rc: 127 },
    { email: 'dr.cherif@freya.dz',   fn: 'Amina',   ln: 'Chérif',    spec: 'Gynécologue',          ordre: 'ALG-GYN-2018-045',  wilaya: 'Oran',        city: 'Centre',     price: 2500, exp: 10, rating: 4.7, rc: 89  },
    { email: 'dr.meziane@freya.dz',  fn: 'Yacine',  ln: 'Meziane',   spec: 'Neurologue',           ordre: 'ALG-NEU-2012-023',  wilaya: 'Constantine', city: 'Centre',     price: 3500, exp: 18, rating: 4.8, rc: 204 },
    { email: 'dr.boukhari@freya.dz', fn: 'Fatima',  ln: 'Boukhari',  spec: 'Pédiatre',             ordre: 'ALG-PED-2016-067',  wilaya: 'Blida',       city: 'Centre',     price: 2000, exp: 12, rating: 4.9, rc: 312 },
    { email: 'dr.ait@freya.dz',      fn: 'Sofiane', ln: 'Aït Ahmed', spec: 'Dermatologue',         ordre: 'ALG-DER-2019-089',  wilaya: 'Tizi Ouzou',  city: 'Centre',     price: 2500, exp: 8,  rating: 4.6, rc: 56  },
    { email: 'dr.khelil@freya.dz',   fn: 'Nadia',   ln: 'Khelil',    spec: 'Ophtalmologue',        ordre: 'ALG-OPH-2014-034',  wilaya: 'Annaba',      city: 'Centre',     price: 3000, exp: 14, rating: 4.9, rc: 178 },
    { email: 'dr.benameur@freya.dz', fn: 'Rachid',  ln: 'Benameur',  spec: 'Orthopédiste',         ordre: 'ALG-ORT-2011-012',  wilaya: 'Alger',       city: 'Ben Aknoun', price: 4000, exp: 20, rating: 4.7, rc: 95  },
    { email: 'dr.hadj@freya.dz',     fn: 'Leila',   ln: 'Hadj Ali',  spec: 'Psychiatre',           ordre: 'ALG-PSY-2017-078',  wilaya: 'Alger',       city: 'El Biar',    price: 3500, exp: 11, rating: 4.8, rc: 143 },
    { email: 'dr.zeroual@freya.dz',  fn: 'Khaled',  ln: 'Zeroual',   spec: 'Médecin Généraliste',  ordre: 'ALG-GEN-2020-101',  wilaya: 'Sétif',       city: 'Centre',     price: 1500, exp: 6,  rating: 4.5, rc: 67  },
    { email: 'dr.belkacem@freya.dz', fn: 'Sara',    ln: 'Belkacem',  spec: 'Endocrinologue',       ordre: 'ALG-END-2015-055',  wilaya: 'Alger',       city: 'Bab Ezzouar',price: 3500, exp: 13, rating: 4.7, rc: 88  },
  ];

  const doctors = [];
  for (const d of doctorsData) {
    const now = new Date();
    const endDate = new Date(now); endDate.setFullYear(endDate.getFullYear() + 1);
    const u = await prisma.user.create({
      data: {
        email: d.email, password: await hash('password123'), role: 'doctor',
        firstName: d.fn, lastName: d.ln, wilaya: d.wilaya, isActive: true, isVerified: true,
        doctor: {
          create: {
            specialite: d.spec, ordreNumber: d.ordre, ordreVerified: true, adminApproved: true,
            wilaya: d.wilaya, city: d.city, consultationPrice: d.price,
            experienceYears: d.exp, ratingAvg: d.rating, ratingCount: d.rc,
            availabilities: { create: [1,2,3,4,5].map(day => ({ dayOfWeek: day, startTime: '09:00', endTime: '17:00', slotDuration: 30 })) },
            subscriptions:  { create: [{ plan: 'monthly', amount: 2990, status: 'active', startDate: now, endDate }] },
          }
        }
      },
      include: { doctor: true }
    });
    doctors.push(u.doctor);
  }

  // Cliniques
  await prisma.clinic.createMany({ data: [
    { name: 'Clinique El Azhar',      address: '12 Rue Didouche Mourad',       wilaya: 'Alger',       city: 'Centre',  phone: '021123456', adminApproved: true },
    { name: 'Polyclinique Ibn Sina',  address: '45 Boulevard Zighout Youcef',  wilaya: 'Oran',        city: 'Centre',  phone: '041654321', adminApproved: true },
    { name: 'Clinique Santé Plus',    address: '8 Rue des Frères Bouadou',     wilaya: 'Constantine', city: 'Centre',  phone: '031234567', adminApproved: true },
  ]});

  // Rendez-vous
  const today    = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const yesterday= new Date(today); yesterday.setDate(today.getDate() - 1);

  const appts = await Promise.all([
    prisma.appointment.create({ data: { doctorId: doctors[0].id, patientId: patients[0].id, appointmentDate: today,     appointmentTime: '09:00', status: 'confirmed', motif: 'Suivi tension artérielle' } }),
    prisma.appointment.create({ data: { doctorId: doctors[0].id, patientId: patients[1].id, appointmentDate: today,     appointmentTime: '10:30', status: 'confirmed', motif: 'Bilan cardiaque annuel', isFirstVisit: true } }),
    prisma.appointment.create({ data: { doctorId: doctors[1].id, patientId: patients[2].id, appointmentDate: tomorrow,  appointmentTime: '14:00', status: 'pending',   motif: 'Suivi gynécologique' } }),
    prisma.appointment.create({ data: { doctorId: doctors[2].id, patientId: patients[0].id, appointmentDate: tomorrow,  appointmentTime: '11:00', status: 'pending',   motif: 'Migraines chroniques' } }),
    prisma.appointment.create({ data: { doctorId: doctors[0].id, patientId: patients[0].id, appointmentDate: yesterday, appointmentTime: '09:00', status: 'completed', motif: 'Consultation initiale' } }),
  ]);

  // Avis
  await prisma.review.create({ data: { doctorId: doctors[0].id, patientId: patients[0].id, appointmentId: appts[4].id, rating: 5, comment: 'Excellent médecin, très attentif et professionnel.', isAnonymous: false } });

  // Conversation + messages
  const docUser0 = await prisma.user.findFirst({ where: { doctor: { id: doctors[0].id } } });
  const conv = await prisma.conversation.create({
    data: {
      doctorId: doctors[0].id, patientId: patients[0].id,
      messages: { create: [
        { senderId: patients[0].id, content: "Bonjour Docteur, j'ai des douleurs après l'ordonnance. Est-ce normal ?", isRead: true },
        { senderId: docUser0.id,    content: "Bonjour M. Bensalem, c'est normal les 3 premiers jours. Continuez le traitement.", isRead: false },
        { senderId: patients[0].id, content: "Merci beaucoup Docteur !", isRead: false },
      ]}
    }
  });

  // Dossiers médicaux
  await prisma.medicalRecord.createMany({ data: [
    { patientId: patients[0].id, doctorId: doctors[0].id, appointmentId: appts[4].id, recordType: 'consultation', title: 'Consultation cardiologie initiale', diagnosis: 'Hypertension artérielle stade 1', prescription: 'Amlodipine 5mg - 1 comprimé/jour pendant 3 mois.' },
    { patientId: patients[0].id, doctorId: doctors[0].id, recordType: 'analyse',      title: 'Bilan sanguin complet', diagnosis: 'Diabète type 2 découvert. Glycémie : 1.42 g/L.', prescription: 'Metformine 500mg - 2x/jour.' },
    { patientId: patients[0].id, doctorId: doctors[0].id, recordType: 'ordonnance',   title: 'Ordonnance renouvellement', prescription: 'Amlodipine 5mg x30 - Metformine 500mg x60' },
  ]});

  console.log('✅ Admin     : admin@freya.dz / admin123');
  console.log('✅ Patient   : patient@freya.dz / password123');
  console.log('✅ Médecin   : dr.benali@freya.dz / password123');
  console.log('\n🎉 Seed terminé !');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());