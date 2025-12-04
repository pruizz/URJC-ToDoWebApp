import express from "express";
import * as userService from "../services/user.service.js";
import { createUser } from "../repos/user.repo.js";

export const usersRouter = express.Router();

usersRouter.post("/api/logout", (req, res) => {
    res.clearCookie('user');
    res.json(true);
});

usersRouter.post("/api/checkUser", async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.getUser(username);

    if (user && user.password === password) {
        res.cookie('user', user.username, { httpOnly: true });
        res.json(user);
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

usersRouter.post("/api/duplicateUsername", async (req, res) => {
    let username = req.body.username;
    let result = await userService.isUsernameAvailable(username);
    res.json(result);
});

usersRouter.post("/api/duplicateEmail", async (req, res) => {
    let email = req.body.email;
    let result = await userService.isEmailAvailable(email);
    res.json(result);
});

usersRouter.post("/api/newUser", async (req, res) => {
    const { username, email, password, profile_photo } = req.body;
    const newUser = createUser(username, email, password, profile_photo);
    const result = await userService.createUser(newUser);
    res.json(result);
});
