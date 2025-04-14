const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Actualiza con las credenciales de tu contenedor Docker
        const mongoURI = 'mongodb://admin:admin@localhost:27017/mi_base_de_datos?authSource=admin';

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB conectado correctamente a mi_base_de_datos');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error);
        console.error(error.stack);
        process.exit(1);
    }
};

module.exports = connectDB;
