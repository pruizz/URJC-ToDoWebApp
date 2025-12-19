# 📝 TACHAO - To-Do Web App

**Aplicación web de gestión de tareas desarrollada para la asignatura de Procesos de Software**  
Universidad Rey Juan Carlos (URJC) - 3º año, 1º cuatrimestre

🌐 **Aplicación en producción**: [https://tachao.vercel.app](https://tachao.vercel.app)

---

## 🚀 Descripción

**TACHAO** es una aplicación web completa de gestión de tareas (To-Do List) que permite a los usuarios organizar su trabajo de manera eficiente e intuitiva. Cuenta con un sistema de autenticación, gestión de proyectos, visualización de calendario y personalización de perfiles.

### ✨ Funcionalidades principales

- 🔐 **Autenticación de usuarios**: Registro e inicio de sesión con validación
- ➕ **Gestión de tareas**: Crear, editar, eliminar y completar tareas
- 🎯 **Prioridades**: Sistema de prioridades (Alta, Media, Baja) con codificación visual
- 📁 **Proyectos**: Organización de tareas en proyectos personalizados con colores
- 📅 **Vista de calendario**: Visualización de tareas en calendario interactivo (FullCalendar)
- 🔍 **Filtros avanzados**: Filtrar tareas por estado, prioridad y proyecto
- 👤 **Perfiles personalizados**: Foto de perfil con carga de imágenes (convertidas a base64)
- 📊 **Dashboard**: Resumen visual con estadísticas de tareas
- 💾 **Persistencia de datos**: Base de datos MongoDB en la nube

---

## 🛠️ Tecnologías utilizadas

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js 5.1.0** - Framework web
- **MongoDB 7.0.0** - Base de datos NoSQL
- **Mustache Express** - Motor de plantillas del lado del servidor
- **Cookie-parser** - Manejo de sesiones
- **Multer** - Procesamiento de archivos
- **dotenv** - Variables de entorno

### Frontend
- **HTML5** & **CSS3**
- **JavaScript** (Vanilla)
- **Bootstrap 5.3** - Framework CSS
- **FullCalendar 6.1** - Librería de calendario
- **Flatpickr** - Selector de fechas
- **Bootstrap Icons**

### Base de datos
- **MongoDB Atlas** - Base de datos en la nube

### Deployment
- **Vercel** - Plataforma de despliegue y hosting

### Gestión del proyecto
- **Git/GitHub** - Control de versiones
- **pnpm** - Gestor de paquetes
- **Metodología Ágil** - Desarrollo iterativo

---

## 📂 Estructura del proyecto

```
URJC-ToDoWebApp/
├── src/
│   ├── adapters/          # Comunicación con MongoDB
│   │   └── mongo.adapter.js
│   ├── middlewares/       # Middleware de autenticación
│   │   └── auth.middleware.js
│   ├── repos/            # Modelos de datos (factory pattern)
│   │   ├── task.repo.js
│   │   ├── user.repo.js
│   │   └── project.repo.js
│   ├── routes/           # Definición de rutas
│   │   ├── base.route.js
│   │   ├── users.route.js
│   │   ├── tasks.route.js
│   │   └── projects.route.js
│   ├── services/         # Lógica de negocio
│   │   ├── user.service.js
│   │   └── todo.service.js
│   ├── utils/            # Utilidades
│   │   └── uuid.utils.js
│   ├── views/            # Plantillas Mustache
│   │   ├── head.html
│   │   ├── aside.html
│   │   ├── footer.html
│   │   ├── login.html
│   │   ├── registerForm.html
│   │   ├── index.html
│   │   ├── tasks.html
│   │   ├── calendar.html
│   │   └── projects.html
│   └── app.js            # Punto de entrada de la aplicación
├── public/               # Recursos estáticos
│   ├── style/
│   │   ├── unique.css
│   │   └── images/
│   ├── auth.script.js
│   ├── tasks.script.js
│   └── ui.script.js
├── .env                  # Variables de entorno (no incluido en repo)
├── package.json
└── README.md
```

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura en capas** para separar responsabilidades:

```
Request → Route → Middleware → Service → Adapter → MongoDB
```

1. **Routes**: Punto de entrada de peticiones HTTP
2. **Middleware**: Validación de autenticación y sesiones
3. **Services**: Lógica de negocio
4. **Repos**: Creación de objetos estandarizados
5. **Adapters**: Comunicación con la base de datos MongoDB

---

## 🗄️ Base de datos MongoDB

### Estructura de colección `users`

```javascript
{
  username: String,
  email: String,
  password: String,
  badge: Array,
  profile_photo: String (base64 data URL),
  projects: [
    {
      id: String (UUID),
      title: String,
      color: String,
      isActive: Boolean,
      tasks: [
        {
          id: String (UUID),
          title: String,
          description: String,
          dueDate: String (YYYY-MM-DD),
          priority: String ("high", "medium", "low"),
          completed: Boolean,
          createdAt: Date
        }
      ]
    }
  ]
}
```

### Conexión

La aplicación se conecta a MongoDB Atlas usando la variable de entorno `MONGO_DB_URI`.

---

## 🚀 Instalación y configuración

### Requisitos previos

- Node.js >= 14.x
- pnpm (recomendado) o npm
- Cuenta de MongoDB Atlas
- Cuenta de Vercel (para deployment)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/pruizz/URJC-ToDoWebApp.git
cd URJC-ToDoWebApp
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:
```env
MONGO_DB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/web?retryWrites=true&w=majority
```

4. **Ejecutar en modo desarrollo**
```bash
pnpm start
# o
pnpm run watch  # Con auto-reload usando nodemon
```

5. **Acceder a la aplicación**
```
http://localhost:3000
```

---

## 📦 Scripts disponibles

```json
{
  "start": "node src/app.js",
  "watch": "nodemon -e js,html,css src/app.js"
}
```

- **`pnpm start`**: Inicia el servidor en producción
- **`pnpm run watch`**: Inicia el servidor en modo desarrollo con auto-reload

---

## 🌐 Deployment en Vercel

La aplicación está desplegada en **Vercel** y accesible en:  
👉 **[https://tachao.vercel.app](https://tachao.vercel.app)**

### Pasos para el deployment

1. Conectar el repositorio de GitHub con Vercel
2. Configurar las variables de entorno en Vercel:
   - `MONGO_DB_URI`: URI de conexión a MongoDB Atlas
3. Vercel detecta automáticamente el proyecto Node.js
4. Deploy automático en cada push a `main`

---

## 👥 Equipo de desarrollo

- **Isidoro Perez Rivera**
- **Pablo Ruiz Uroz**
- **Jaime Sanchez Vazquez**
- **Ivan Pina Brox**
- **Jaime Portillo**

---

## 📄 Licencia

ISC License

---

## 📝 Notas de desarrollo

Para información técnica detallada sobre la arquitectura y el flujo de desarrollo, consultar el archivo [`DEV_NOTES.md`](DEV_NOTES.md).

---

## 🎯 Objetivos del proyecto

Este proyecto fue desarrollado como parte de la asignatura **Procesos de Software** con los siguientes objetivos:

- Aplicar **metodologías ágiles** de desarrollo de software
- Implementar **buenas prácticas** de programación
- Utilizar **control de versiones** con Git/GitHub
- Desarrollar una aplicación **full-stack** completa
- Trabajar en **equipo** de manera colaborativa
- Realizar **deployment** en producción

---

**¡Gracias por visitar TACHAO! 🎉**