// ============================================================
//  routes/auth.js
// ============================================================
const router      = require('express').Router();
const ctrl        = require('../controllers/authController');
const { auth }    = require('../middleware/auth');

router.post('/register/patient', ctrl.registerPatient);
router.post('/register/doctor',  ctrl.registerDoctor);
router.post('/login',            ctrl.login);
router.get('/me',                auth, ctrl.getMe);
router.put('/profile',           auth, ctrl.updateProfile);
router.put('/password',          auth, ctrl.changePassword);

module.exports = router;