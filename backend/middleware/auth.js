const jwt     = require('jsonwebtoken');
const prisma  = require('../prisma/client');

// ─── Vérifie le token JWT ─────────────────────────────────────────────────────
const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token manquant. Veuillez vous connecter.' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, firstName: true, lastName: true, isActive: true }
    });
    if (!user)       return res.status(401).json({ error: 'Utilisateur introuvable.' });
    if (!user.isActive) return res.status(403).json({ error: 'Compte désactivé.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};

// ─── Vérifie le rôle ──────────────────────────────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: 'Accès refusé. Droits insuffisants.' });
  next();
};

module.exports = { auth, requireRole };