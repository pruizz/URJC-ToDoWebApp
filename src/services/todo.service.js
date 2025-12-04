import { createOrUpdateOne, getOne } from "../adapters/mongo.adapter.js";
import { getUser } from "./user.service.js";

const COLLECTION_USERS = "users";

// Add a new task to a user
export async function addTaskToUser(username, task) {
    const user = await getUser(username);

    // Check if user exists
    if (!user) {
        throw new Error("User not found");
    }

    // Add the new task to the user's tasks array
    user.tasks.push(task);

    // Update the user document in the database
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}

// Remove a task from a user
export async function removeTaskFromUser(username, taskId) {
    const user = await getUser(username);

    // Check if user exists
    if (!user) {
        throw new Error("User not found");
    }

    // Remove the task with the specified taskId from the user's tasks array
    user.tasks = user.tasks.filter(task => task.id !== taskId);

    // Update the user document in the database
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}

// Update a task for a user
export async function updateTaskForUser(username, updatedTask) {
    const user = await getUser(username);

    // Check if user exists
    if (!user) {
        throw new Error("User not found");
    }

    // Find the index of the task to be updated
    const taskIndex = user.tasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex === -1) {
        throw new Error("Task not found");
    }

    // Update the task details
    Object.assign(user.tasks[taskIndex], updatedTask);
    // Update the user document in the database
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}

// Mark a task as completed or not completed
export async function markTaskAs(username, taskId, completed) {
    const user = await getUser(username);

    // Check if user exists
    if (!user) {
        throw new Error("User not found");
    }

    // Find the task to be marked
    const task = user.tasks.find(task => task.id === taskId);

    if (!task) {
        throw new Error("Task not found");
    }

    // Mark the task as completed or not completed
    task.completed = completed;

    // Update the user document in the database
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}

export function getAllTasks(user) {
    return user.tasks;
}
