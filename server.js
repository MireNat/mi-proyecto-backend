const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Inicializar la app de Express
const app = express();
const PORT = process.env.PORT || 4000;

// Conectar a la base de datos
connectDB();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Ruta por defecto
app.get('/', (req, res) => {
    res.json({ message: 'API de Gestor de Tareas funcionando correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
