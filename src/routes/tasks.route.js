import express from "express";
import * as toDoService from "../services/todo.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTask } from "../repos/task.repo.js";

export const tasksRouter = express.Router();

tasksRouter.use(authMiddleware);

tasksRouter.post("/api/task/add", async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    const newTask = createTask(title, description, dueDate, priority);
    await toDoService.addTaskToUser(req.user.username, newTask);
    const redirectTo = req.body.redirectTo || '/home';
    res.redirect(redirectTo);
});

tasksRouter.post('/api/tasks/:id/toggleComplete', async (req, res) => {
    const id = req.params.id;
    const task = req.user.projects.find(project => project.id === req.user.activeProject).tasks.find(t => t.id === id);
    if (task) {
        try {
            const updatedUser = await toDoService.markTaskAs(req.user.username, id, !task.completed);
            const updatedTask = updatedUser.projects.find(project => project.id === updatedUser.activeProject).tasks.find(t => t.id === id);
            res.json({ success: true, task: updatedTask });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update task' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Task not found' });
    }
});

tasksRouter.delete("/api/tasks/:id", async (req, res) => {
    let id = req.params.id;
    let result = await toDoService.removeTaskFromUser(req.user.username, id);
    res.json(!!result);
});

tasksRouter.post("/api/tasks/:id/update", async (req, res) => {
    const id = req.params.id;
    const updatedTask = {
        id: id,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority
    };
    try {
        const result = await toDoService.updateTaskForUser(req.user.username, updatedTask);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update task' });
    }
});




