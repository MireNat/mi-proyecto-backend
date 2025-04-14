# Gestor de Tareas - Backend

Backend para la aplicación de gestión de tareas desarrollado con Node.js, Express y MongoDB.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor
- **Express**: Framework para aplicaciones web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación con JSON Web Tokens
- **bcryptjs**: Encriptación de contraseñas
- **express-validator**: Validación de datos

## Estructura del proyecto

```
task-manager-backend/
├── config/
│   └── db.js             # Configuración de la base de datos
├── controllers/
│   ├── authController.js # Controlador de autenticación
│   └── taskController.js # Controlador de tareas
├── middleware/
│   ├── auth.js           # Middleware para verificar JWT
│   └── validation.js     # Validación de entradas
├── models/
│   ├── User.js           # Modelo de usuario
│   └── Task.js           # Modelo de tarea
├── routes/
│   ├── authRoutes.js     # Rutas de autenticación 
│   └── taskRoutes.js     # Rutas de tareas
├── .env                  # Variables de entorno
├── .gitignore            # Archivos a ignorar en git
├── package.json          # Dependencias y scripts
├── server.js             # Punto de entrada del servidor
└── README.md             # Documentación
```

## Requisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)

## Configuración

1. Clona el repositorio:
   ```
   git clone https://github.com/MireNat/mi-proyecto-backend
   cd task-manager-backend
   ```

2. Instala dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   PORT=4000
   JWT_SECRET=tu_secreto_para_jwt
   NODE_ENV=development
   ```

## Ejecución

Para desarrollo (con nodemon):
```
npm run dev
```

Para producción:
```
npm start
```

## API Endpoints

### Autenticación

| Método | Endpoint             | Descripción                                        |
|--------|----------------------|----------------------------------------------------|
| POST   | /api/auth/register   | Registrar nuevo usuario                            |
| POST   | /api/auth/login      | Iniciar sesión y obtener token                     |
| GET    | /api/auth/me         | Obtener información del usuario autenticado        |

### Tareas

| Método | Endpoint             | Descripción                                        |
|--------|----------------------|----------------------------------------------------|
| GET    | /api/tasks           | Obtener todas las tareas del usuario               |
| GET    | /api/tasks/:id       | Obtener una tarea específica                       |
| POST   | /api/tasks           | Crear una nueva tarea                              |
| PUT    | /api/tasks/:id       | Actualizar una tarea existente                     |
| PUT    | /api/tasks/:id/complete | Marcar una tarea como completada                 |
| DELETE | /api/tasks/:id       | Eliminar una tarea                                 |

## Filtros y búsqueda

Para filtrar tareas por estado:
```
GET /api/tasks?status=pendiente
```

Para buscar tareas por título o descripción:
```
GET /api/tasks?search=proyecto
```

Ambos filtros pueden combinarse:
```
GET /api/tasks?status=pendiente&search=proyecto
```
