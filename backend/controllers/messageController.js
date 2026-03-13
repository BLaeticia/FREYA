const messageService = require('../services/messageService');

const getConversations = async (req, res, next) => {
  try { res.json(await messageService.getConversations(req.user)); } catch (err) { next(err); }
};
const createConversation = async (req, res, next) => {
  try {
    const patientId = req.user.role === 'patient' ? req.user.id : req.body.patientId;
    res.json(await messageService.getOrCreateConversation(patientId, req.body.doctorId));
  } catch (err) { next(err); }
};
const getMessages = async (req, res, next) => {
  try { res.json(await messageService.getMessages(req.params.id, req.user.id)); } catch (err) { next(err); }
};
const sendMessage = async (req, res, next) => {
  try { res.status(201).json(await messageService.sendMessage(req.params.id, req.user.id, req.body.content)); } catch (err) { next(err); }
};

module.exports = { getConversations, createConversation, getMessages, sendMessage };