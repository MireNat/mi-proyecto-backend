const express = require('express');
const { check } = require('express-validator');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask
} = require('../controllers/taskController');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// @route   POST /api/tasks
// @desc    Crear una nueva tarea
// @access  Private
router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
    ],
    validate,
    createTask
);

// @route   GET /api/tasks
// @desc    Obtener todas las tareas del usuario
// @access  Private
router.get('/', getTasks);

// @route   GET /api/tasks/:id
// @desc    Obtener una tarea específica
// @access  Private
router.get('/:id', getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Actualizar una tarea
// @access  Private
router.put('/:id', updateTask);

// @route   PUT /api/tasks/:id/complete
// @desc    Marcar tarea como completada
// @access  Private
router.put('/:id/complete', completeTask);

// @route   DELETE /api/tasks/:id
// @desc    Eliminar una tarea
// @access  Private
router.delete('/:id', deleteTask);

module.exports = router;
