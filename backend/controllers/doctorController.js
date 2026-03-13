// ============================================================
//  doctorController.js
// ============================================================
const doctorService = require('../services/doctorService');

const search = async (req, res, next) => {
  try { res.json(await doctorService.searchDoctors(req.query)); } catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { res.json(await doctorService.getDoctorById(req.params.id)); } catch (err) { next(err); }
};
const getAvailability = async (req, res, next) => {
  try { res.json(await doctorService.getAvailability(req.params.id, req.query.date)); } catch (err) { next(err); }
};
const getDashboardStats = async (req, res, next) => {
  try { res.json(await doctorService.getDashboardStats(req.user.id)); } catch (err) { next(err); }
};
const updateProfile = async (req, res, next) => {
  try { res.json(await doctorService.updateDoctorProfile(req.user.id, req.body)); } catch (err) { next(err); }
};
const setAvailability = async (req, res, next) => {
  try { res.json(await doctorService.setAvailability(req.user.id, req.body.slots)); } catch (err) { next(err); }
};
const getSpecialites = (req, res) => res.json(doctorService.getSpecialites());

module.exports = { search, getById, getAvailability, getDashboardStats, updateProfile, setAvailability, getSpecialites };