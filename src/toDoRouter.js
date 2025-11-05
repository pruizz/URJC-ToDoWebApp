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
    const calendarTasks = tasks.map(task => ({
        title: task.title,
        start: task.dueDate,
        description: task.description
    }));
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
    res.render("index", {
        tasks: allTasks,
        tareasRecientes: recientes,
        user: currentUser || { name: "Invitado" }
    });
})

router.get("/tasks", (req, res) => {
    res.render("tasks", { tasks: toDoService.getAllTasks(), user: currentUser || { name: "Invitado" } });
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
    let id = Number(req.params.index);
    let result = toDoService.deleteUserTask(id, currentUser);
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
        profile_photo: "default.png",
        tasks: []
    }

    let result = toDoService.addUser(user);

    res.json(result);

});

router.get("/register", (req, res) => {
    res.render("registerForm");

});






export default router;