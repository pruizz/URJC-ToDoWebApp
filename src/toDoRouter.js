import express from "express";
import multer from "multer";
import fs from "node:fs/promises";

import * as toDoService from "./toDoService.js";
import { create } from "node:domain";

const UPLOADS_FOLDER = "uploads";
const DEMO_FOLDER = "demo";

const router = express.Router();
const upload = multer({ dest: UPLOADS_FOLDER });


let currentUser = null;

router.get("/", (req, res) => {
    res.render("login", { tasks: toDoService.getAllTasks(currentUser) });
});

router.get("/newTask", (req, res) => {
    res.render("newTask");
});

router.get("/calendar", (req, res) => {
    if (!currentUser) {
        return res.redirect("/");
    }
    const tasks = toDoService.getAllTasks(currentUser);

    const calendarTasks = tasks.map(task => {
        let color = '#0d6efd'; // Default color (Bootstrap primary)
        const priority = (task.priority || '').toLowerCase();

        if (priority === 'high' || priority === 'alta') {
            color = '#dc3545'; // Bootstrap danger color for high priority
        } else if (priority === 'medium' || priority === 'media') {
            color = '#ffc107'; // Bootstrap warning color for medium priority
        } else if (priority === 'low' || priority === 'baja') {
            color = '#198754'; // Bootstrap success color for low priority
        }

        return {
            title: task.title,
            start: task.dueDate,
            description: task.description,
            color: color // Add the color property here
        };
    });

    res.render("calendar", { tasks: JSON.stringify(calendarTasks) });
});

router.get("/home", (req, res) => {
    if (!currentUser) {
        return res.redirect("/");
    }
    const allTasks = toDoService.getAllTasks(currentUser);
    // Ordenar por fecha de creación descendente
    const recientes = allTasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2)
        .map(t => {
            // Normalizar prioridad a valores esperados por CSS: High | Medium | Low
            let p = (t.priority || '').toString().toLowerCase();
            let normalized = 'Low';
            if (p === 'high' || p === 'alta' || p === 'alta 🔴') normalized = 'High';
            else if (p === 'medium' || p === 'media' || p === 'media 🟡') normalized = 'Medium';

            return {
                id: t.id,
                titulo: t.title,
                fecha: t.dueDate,
                completada: t.completed,
                priority: normalized
            };
        });

    // Preparar datos del calendario: agrupar por fecha y mantener la prioridad más alta
    const taskDateMap = {};
    allTasks.forEach(task => {
        if (!task.dueDate) {
            return; // Saltar tareas sin fecha
        }

        const priorityValue = (task.priority || '').toLowerCase();
        let level = 3; // baja por defecto
        let normalizedPriority = 'baja';

        if (priorityValue === 'high' || priorityValue === 'alta' || priorityValue === 'alta 🔴') {
            level = 1;
            normalizedPriority = 'alta';
        } else if (priorityValue === 'medium' || priorityValue === 'media' || priorityValue === 'media 🟡') {
            level = 2;
            normalizedPriority = 'media';
        }

        const existing = taskDateMap[task.dueDate];
        if (!existing || level < existing.level) {
            taskDateMap[task.dueDate] = {
                date: task.dueDate,
                priority: normalizedPriority,
                level
            };
        }
    });

    const taskDatesWithPriority = Object.values(taskDateMap);
    const taskDatesJson = JSON.stringify(taskDatesWithPriority);

    let pendingTasks = allTasks.length - currentUser.tasksCompleted;
    res.render("index", {
        pendingTasks: pendingTasks,
        tasks: allTasks,
        tareasRecientes: recientes,
        user: currentUser || { name: "Invitado" },
        taskDatesJson: taskDatesJson
    });
})

router.get("/tasks", (req, res) => {
    if (!currentUser) {
        return res.redirect('/');
    }
    const tasks = toDoService.getAllTasks(currentUser) || [];
    res.render("tasks", { tasks: tasks, user: currentUser || { name: "Invitado" } });
})

router.post("/task/add", (req, res) => {

    let task = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        completed: false,
        createdAt: new Date()
    }
    if (!currentUser) {
        // no user logged in -> can't add task
        return res.redirect('/');
    }
    toDoService.addUserTask(task, currentUser);
    // Si el formulario envía un campo redirectTo lo usamos, si no comprobamos el referer
    const redirectTo = req.body.redirectTo;
    if (redirectTo) {
        return res.redirect(redirectTo);
    }

    const ref = req.get('referer') || '';
    if (ref.includes('/tasks')) {
        return res.redirect('/tasks');
    }

    res.redirect('/home');
});

// Toggle completion state for a task
router.post('/tasks/:id/toggleComplete', (req, res) => {
    if (!currentUser) return res.redirect('/');
    const id = Number(req.params.id);
    const task = currentUser.tasks.find(t => t.id === id);
    if (task) {
        const wasCompleted = task.completed;
        task.completed = !task.completed;
        if (currentUser.tasksCompleted === undefined || currentUser.tasksCompleted === null) {
            currentUser.tasksCompleted = 0;
        }
        if (!wasCompleted && task.completed) {
            currentUser.tasksCompleted++;
        } else if (wasCompleted && !task.completed) {
            currentUser.tasksCompleted--;
        }
        // persist
        toDoService.saveDataToDisk();
    }

    const redirectTo = req.body.redirectTo;
    if (redirectTo) return res.redirect(redirectTo);
    const ref = req.get('referer') || '';
    if (ref.includes('/tasks')) return res.redirect('/tasks');
    return res.redirect('/home');
});

/* router.post("/task/add", upload.single("image"),(req,res) => {
    let image = req.file ? req.file.filename : undefined;

    let task = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        completed: false,
        createdAt: new Date(Date.now()).toLocaleDateString("es-ES")
    }
    toDoService.addTask(task);
    res.redirect("/home");
}); */

router.post("/tasks/:id/delete", (req, res) => {
    if (!currentUser) return res.json(false);
    let id = Number(req.params.id);
    let result = toDoService.deleteUserTask(id, currentUser);
    if (result.completed){
        currentUser.tasksCompleted--;
    }
    toDoService.saveDataToDisk();
    res.json(!!result);
});

router.post("/tasks/:id/update", (req, res) => {
    let id = Number(req.params.id);
    let updatedTask = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority
    };
    let result = toDoService.updateUserTask(id, updatedTask, currentUser);
    res.json(result);
});

router.post("/currentUser/null", (req, res) => {
    currentUser = null;
    res.json(true);
});

router.post("/checkUser", (req, res) => {
    let user_login = req.body;

    let result = toDoService.checkUserPass(user_login.username, user_login.password);

    if (result) {
        currentUser = result;
    } else {
        currentUser = null;
    }

    res.json(result);

});

router.post("/duplicateUsername", (req, res) => {
    let username = req.body.username;

    let result = toDoService.checkUserAvailable(username);

    res.json(result);

});

router.post("/duplicateEmail", (req, res) => {
    let email = req.body.email;

    let result = toDoService.checkEmailAvailable(email);

    res.json(result);

});

router.post("/newUser", (req, res) => {
    let userAux = req.body;

    let user = {
        username: userAux.username,
        email: userAux.email,
        password: userAux.password,
        badge: [],
        profile_photo: userAux.profile_photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        tasks: []
    }

    let result = toDoService.addUser(user);

    res.json(result);

});

router.get("/register", (req, res) => {
    res.render("registerForm");

});






export default router;