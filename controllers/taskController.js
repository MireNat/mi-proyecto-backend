const Task = require('../models/Task');

// @desc    Crear una nueva tarea
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;

        // Verificar que el título exista
        if (!title) {
            return res.status(400).json({ message: 'El título es obligatorio' });
        }

        // Crear la tarea
        const task = await Task.create({
            user: req.user._id,
            title,
            description,
            status: 'pendiente', // Una tarea nueva siempre inicia como pendiente
            dueDate,
        });

        res.status(201).json({
            message: 'Tarea creada exitosamente',
            task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { user: req.user._id };

        // Filtrar por estado si se proporciona
        if (status) {
            query.status = status;
        }

        // Buscar por título o descripción si se proporciona
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Obtener una tarea específica
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        // Verificar si la tarea existe
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Verificar si la tarea pertenece al usuario
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Actualizar una tarea
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const task = await Task.findById(req.params.id);

        // Verificar si la tarea existe
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Verificar si la tarea pertenece al usuario
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Verificar si la tarea está completada (no se puede modificar)
        if (task.status === 'completada') {
            return res.status(400).json({
                message: 'No se puede modificar una tarea completada',
            });
        }

        // Validar las transiciones de estado
        if (status) {
            // Solo se puede marcar como "en progreso" si está en "pendiente"
            if (status === 'en progreso' && task.status !== 'pendiente') {
                return res.status(400).json({
                    message: 'Solo se puede marcar como "en progreso" si está en "pendiente"',
                });
            }

            // Solo se puede marcar como "completada" si está en "en progreso"
            if (status === 'completada' && task.status !== 'en progreso') {
                return res.status(400).json({
                    message: 'Solo se puede marcar como "completada" si está en "en progreso"',
                });
            }

            // No se puede volver a "pendiente" desde "en progreso" o "completada"
            if (status === 'pendiente' && task.status !== 'pendiente') {
                return res.status(400).json({
                    message: 'No se puede volver a "pendiente" desde "en progreso" o "completada"',
                });
            }
        }

        // Actualizar la tarea
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;

        const updatedTask = await task.save();

        res.json({
            message: 'Tarea actualizada exitosamente',
            task: updatedTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Marcar tarea como completada
// @route   PUT /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        // Verificar si la tarea existe
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Verificar si la tarea pertenece al usuario
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Solo se puede marcar como "completada" si está "en progreso"
        if (task.status !== 'en progreso') {
            return res.status(400).json({
                message: 'Solo se puede marcar como "completada" si está en "en progreso"',
            });
        }

        task.status = 'completada';
        const updatedTask = await task.save();

        res.json({
            message: 'Tarea marcada como completada',
            task: updatedTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        // Verificar si la tarea existe
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Verificar si la tarea pertenece al usuario
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Solo si la tarea está en estado "Completada"
        if (task.status !== 'completada') {
            return res.status(400).json({
                message: 'Solo se puede eliminar una tarea completada',
            });
        }

        await Task.deleteOne({ _id: req.params.id });

        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    completeTask,
    deleteTask,
};
