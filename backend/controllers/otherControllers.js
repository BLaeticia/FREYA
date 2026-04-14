const recordService = require('../services/recordService');
const reviewService = require('../services/reviewService');
const adminService = require('../services/adminService');
const notificationService = require('../services/notificationService');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const recordController = {
  getRecords:    async (req, res, next) => { try { res.json(await recordService.getRecords(req.user, req.query.patient_id)); } catch (e) { next(e); } },
  addRecord:     async (req, res, next) => { try { res.status(201).json(await recordService.addRecord(req.user.id, req.body)); } catch (e) { next(e); } },
  getProfile:    async (req, res, next) => { try { res.json(await recordService.getProfile(req.user.id)); } catch (e) { next(e); } },

  updateProfile: async (req, res, next) => { 
    try { 
      const userId = req.user.id;
      // On récupère tout ce que le front envoie
      const { phone, bloodGroup, birthDate, gender, height, weight, allergies, chronicDiseases } = req.body;
      
      console.log("Tentative de mise à jour Prisma pour l'ID:", userId);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { 
          phone: phone || undefined,
          patientProfile: {
            upsert: {
              create: {
                bloodType: bloodGroup || "",
                dateOfBirth: birthDate ? new Date(birthDate) : null,
                gender: gender || null,
                height: height ? parseInt(height) : null,
                weight: weight ? parseInt(weight) : null,
                allergies: allergies || "",
                chronicDiseases: chronicDiseases || ""
                // NOTE: J'ai enlevé insurance et ssn car ils manquent dans ton schema.prisma
              },
              update: {
                bloodType: bloodGroup || undefined,
                dateOfBirth: birthDate ? new Date(birthDate) : undefined,
                gender: gender || undefined,
                height: height ? parseInt(height) : undefined,
                weight: weight ? parseInt(weight) : undefined,
                allergies: allergies || undefined,
                chronicDiseases: chronicDiseases || undefined
              }
            }
          }
        },
        include: { patientProfile: true }
      });

      console.log("✅ Succès !");
      // On renvoie un objet simple. React cherche souvent 'success' ou juste le statut 200
      return res.status(200).json({ 
        success: true,
        message: "Profil mis à jour !", 
        user: updatedUser 
      });
    } catch (e) { 
      console.error("❌ Erreur Prisma détaillée:", e.message);
      return res.status(500).json({ 
        success: false,
        message: "Erreur lors de la mise à jour" 
      });
  }
  }
};

const reviewController = {
  addReview:        async (req, res, next) => { try { res.status(201).json(await reviewService.addReview(req.user.id, req.body)); } catch (e) { next(e); } },
  getDoctorReviews: async (req, res, next) => { try { res.json(await reviewService.getDoctorReviews(req.params.doctorId)); } catch (e) { next(e); } },
};

const adminController = {
  getStats:         async (req, res, next) => { try { res.json(await adminService.getStats()); } catch (e) { next(e); } },
  getPending:       async (req, res, next) => { try { res.json(await adminService.getPendingDoctors()); } catch (e) { next(e); } },
  approveDoctor:    async (req, res, next) => { try { res.json(await adminService.approveDoctor(req.params.id, req.body.approved, req.body.reason)); } catch (e) { next(e); } },
  getAllDoctors:    async (req, res, next) => { try { res.json(await adminService.getAllDoctors(req.query)); } catch (e) { next(e); } },
  toggleUser:       async (req, res, next) => { try { res.json(await adminService.toggleUser(req.params.id)); } catch (e) { next(e); } },
  getClinics:       async (req, res, next) => { try { res.json(await adminService.getClinics()); } catch (e) { next(e); } },
  addClinic:        async (req, res, next) => { try { res.status(201).json(await adminService.addClinic(req.body)); } catch (e) { next(e); } },
};

const notificationController = {
  getAll:       async (req, res, next) => { try { res.json(await notificationService.getAll(req.user.id)); } catch (e) { next(e); } },
  markAllRead:  async (req, res, next) => { try { res.json(await notificationService.markAllRead(req.user.id)); } catch (e) { next(e); } },
  markRead:     async (req, res, next) => { try { res.json(await notificationService.markRead(req.params.id, req.user.id)); } catch (e) { next(e); } },
};

module.exports = { recordController, reviewController, adminController, notificationController };