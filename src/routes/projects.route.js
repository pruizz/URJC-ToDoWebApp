import express from "express";
import * as toDoService from "../services/todo.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const projectsRouter = express.Router();

projectsRouter.use(authMiddleware);

projectsRouter.get("/projects", (req, res) => {
    const projects = req.user.projects.filter(p => p.title !== "Default Project");
    const projectsWithTasks = projects.map(p => ({
        ...p,
        tasks: p.tasks.map(t => ({ ...t, projectId: p.id }))
    }));
    res.render("projects", { projects: projectsWithTasks, user: req.user, defaultProjectId: req.user.projects.find(p => p.title === "Default Project").id });
});

projectsRouter.post("/api/project/:id/toggleActive", async (req, res) => {
    const projectId = req.params.id;
    const username = req.user.username;
    try {
        const updatedUser = await toDoService.toggleProjectActive(username, projectId);
        res.json({ success: true, isActive: updatedUser.projects.find(p => p.id === projectId).isActive });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

projectsRouter.post("/api/project", async (req, res) => {
    const { title, color } = req.body;
    const username = req.user.username;
    try {
        const updatedUser = await toDoService.createProject(username, title, color);
        res.status(200).json({ message: "Project created successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }      
});
