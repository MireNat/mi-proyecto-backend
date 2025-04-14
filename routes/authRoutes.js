const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post(
    '/register',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Por favor incluya un email válido').isEmail(),
        check('password', 'Por favor ingrese una contraseña con 6 o más caracteres').isLength({ min: 6 }),
    ],
    validate,
    registerUser
);

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Por favor incluya un email válido').isEmail(),
        check('password', 'La contraseña es obligatoria').exists(),
    ],
    validate,
    loginUser
);

// @route   GET /api/auth/me
// @desc    Obtener datos del usuario actual
// @access  Private
router.get('/me', protect, getUserProfile);

module.exports = router;
