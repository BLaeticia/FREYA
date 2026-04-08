const jwt     = require('jsonwebtoken');
const prisma  = require('../prisma/client');

// ─── Vérifie le token JWT ─────────────────────────────────────────────────────
const auth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Session expirée. Veuillez vous connecter.' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      // AJOUT : On sélectionne aussi le téléphone et on vérifie les noms de colonnes
      select: { 
        id: true, 
        email: true,
        phone: true,
        role: true, 
        firstName: true, 
        lastName: true, 
        isActive: true 
      }
    });

    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });

    // Sécurité : Vérifie si le compte est actif
    if (!user.isActive) {
      return res.status(403).json({ error: 'Compte désactivé.' });
    }
    req.user = user;
    next();
  } catch (error) {
    // Il est préférable de logger l'erreur côté serveur pour le debug
    console.error("Erreur Auth Middleware:", error.message);
    return res.status(401).json({ error: 'Votre session a expiré.' });
  }
};

// ─── Vérifie le rôle ──────────────────────────────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
 if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès réservé aux ' + roles.join(' ou ') });
 } 
 next();
};

module.exports = { auth, requireRole };