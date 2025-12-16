
import express from "express";
import * as toDoService from "../services/todo.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const baseRouter = express.Router();

// Public routes
baseRouter.get("/", (req, res) => {
    res.render("login");
});

baseRouter.get("/register", (req, res) => {
    res.render("registerForm");
});

// Protected routes
baseRouter.use(authMiddleware);

baseRouter.get("/home", (req, res) => {
    const allTasks = toDoService.getAllTasksFromActiveProjects(req.user);
    const recientes = allTasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2)
        .map(t => {
            let p = (t.priority || '').toString().toLowerCase();
            let normalized = 'Low';
            if (p === 'high' || p === 'alta') normalized = 'High';
            else if (p === 'medium' || p === 'media') normalized = 'Medium';
            return {
                id: t.id,
                titulo: t.title,
                fecha: t.dueDate,
                completada: t.completed,
                priority: normalized,
                projectTitle: t.projectTitle,
                projectColor: t.projectColor,
                projectTextColor: t.projectTextColor,
                showProject: t.projectTitle !== "Default Project"
            };
        });

    const taskDateMap = {};
    allTasks.forEach(task => {
        if (!task.dueDate) return;
        const priorityValue = (task.priority || '').toLowerCase();
        let level = 3;
        let normalizedPriority = 'baja';
        if (priorityValue === 'high' || priorityValue === 'alta') {
            level = 1;
            normalizedPriority = 'alta';
        } else if (priorityValue === 'medium' || priorityValue === 'media') {
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
    const completedTasks = allTasks.filter(t => t.completed).length;
    const pendingTasks = allTasks.length - completedTasks;

    console.log("*******************************", allTasks, req.user)

    res.render("index", {
        pendingTasks: pendingTasks,
        tasksCompleted: completedTasks,
        tasks: allTasks,
        tareasRecientes: recientes,
        user: req.user,
        taskDatesJson: taskDatesJson,
        projects: req.user.projects.filter(p => p.title !== "Default Project"),
        defaultProjectId: req.user.projects.find(p => p.title === "Default Project").id
    });
});

baseRouter.get("/tasks", (req, res) => {
    const tasks = toDoService.getAllTasksFromActiveProjects(req.user) || [];
    const tasksWithShow = tasks.map(t => ({ ...t, showProject: t.projectTitle !== "Default Project" }));
    res.render("tasks", { tasks: tasksWithShow, user: req.user, projects: req.user.projects.filter(p => p.title !== "Default Project"), defaultProjectId: req.user.projects.find(p => p.title === "Default Project").id });
});

baseRouter.get("/newTask", (req, res) => {
    res.render("newTask");
});

baseRouter.get("/calendar", (req, res) => {
    const tasks = toDoService.getAllTasksFromActiveProjects(req.user);
    const calendarTasks = tasks.map(task => {
        const color = task.projectTitle === "Default Project" ? "#9c9c9c" : task.projectColor;
        return {
            title: task.title,
            start: task.dueDate,
            description: task.description,
            color: color
        };
    });
    res.render("calendar", { tasks: JSON.stringify(calendarTasks), user: req.user });
});
