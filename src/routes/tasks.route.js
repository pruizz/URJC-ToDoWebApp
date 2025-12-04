import express from "express";
import * as toDoService from "../services/todo.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const tasksRouter = express.Router();

tasksRouter.use(authMiddleware);

tasksRouter.post("/api/task/add", async (req, res) => {
    let task = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        completed: false,
        createdAt: new Date()
    };
    await toDoService.addTaskToUser(req.user.username, task);
    const redirectTo = req.body.redirectTo || '/home';
    res.redirect(redirectTo);
});

tasksRouter.post('/api/tasks/:id/toggleComplete', async (req, res) => {
    const id = Number(req.params.id);
    const task = req.user.tasks.find(t => t.id === id);
    if (task) {
        await toDoService.markTaskAs(req.user.username, id, !task.completed);
    }
    const redirectTo = req.body.redirectTo || '/home';
    res.redirect(redirectTo);
});

tasksRouter.post("/api/tasks/:id/delete", async (req, res) => {
    let id = Number(req.params.id);
    let result = await toDoService.removeTaskFromUser(req.user.username, id);
    res.json(!!result);
});

tasksRouter.post("/api/tasks/:id/update", async (req, res) => {
    let id = Number(req.params.id);
    let updatedTask = {
        id: id,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority
    };
    let result = await toDoService.updateTaskForUser(req.user.username, updatedTask);
    res.json(result);
});




