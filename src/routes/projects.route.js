import express from "express";
import * as toDoService from "../services/todo.service.js";

export const projectsRouter = express.Router();

projectsRouter.post("/api/project", async (req, res) => {
    const { title } = req.body;
    const username = req.user.username;
    try {
        const updatedUser = await toDoService.createProject(username, title);
        res.status(200).json({ message: "Project created successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }      
});
