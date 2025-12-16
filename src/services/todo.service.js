import { createOrUpdateOne, getOne } from "../adapters/mongo.adapter.js";
import { createProject as createProjectRepo } from "../repos/project.repo.js";
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
    const activeProject = user.projects.find(project => project.id === user.activeProject);
    if (!activeProject) {
        throw new Error("Active project not found");
    }
    activeProject.tasks.push(task);

    // Update the user document in the database
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}

// Add a new task to a specific project
export async function addTaskToProject(username, projectId, task) {
    const user = await getUser(username);

    // Check if user exists
    if (!user) {
        throw new Error("User not found");
    }

    // Find the project
    const project = user.projects.find(project => project.id === projectId);
    if (!project) {
        throw new Error("Project not found");
    }
    project.tasks.push(task);

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

    // Find and remove the task from any active project or default
    let taskRemoved = false;
    for (let project of user.projects) {
        if (project.isActive || project.title === "Default Project") {
            const initialLength = project.tasks.length;
            project.tasks = project.tasks.filter(task => task.id !== taskId);
            if (project.tasks.length < initialLength) {
                taskRemoved = true;
                break;
            }
        }
    }

    if (!taskRemoved) {
        throw new Error("Task not found in active projects");
    }

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

    // Find the task in any active project or default
    let taskIndex = -1;
    let projectIndex = -1;
    for (let i = 0; i < user.projects.length; i++) {
        if (user.projects[i].isActive || user.projects[i].title === "Default Project") {
            const index = user.projects[i].tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                taskIndex = index;
                projectIndex = i;
                break;
            }
        }
    }

    if (taskIndex === -1) {
        throw new Error("Task not found in active projects");
    }

    // Update the task details
    user.projects[projectIndex].tasks[taskIndex] = { ...user.projects[projectIndex].tasks[taskIndex], ...updatedTask };

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

    // Find the task in any active project or default
    let task = null;
    let projectIndex = -1;
    for (let i = 0; i < user.projects.length; i++) {
        if (user.projects[i].isActive || user.projects[i].title === "Default Project") {
            const foundTask = user.projects[i].tasks.find(t => t.id === taskId);
            if (foundTask) {
                task = foundTask;
                projectIndex = i;
                break;
            }
        }
    }

    if (!task) {
        throw new Error("Task not found in active projects");
    }

    // Mark the task as completed or not completed
    task.completed = completed;

    // Update the user document in the database
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}

export function getAllTasks(user) {
    const activeProject = user.projects.find(project => project.id === user.activeProject);
    if (!activeProject) {
        throw new Error("Active project not found");
    }
    return activeProject.tasks;
}

export function getAllTasksFromActiveProjects(user) {
    const tasksWithProject = [];
    user.projects
        .filter(project => project.isActive || project.title === "Default Project")
        .forEach(project => {
            project.tasks.forEach(task => {
                tasksWithProject.push({
                    ...task,
                    projectId: project.id,
                    projectTitle: project.title,
                    projectColor: project.color || "#3CA6A6",
                    projectTextColor: getTextColor(project.color || "#3CA6A6")
                });
            });
        });
    return tasksWithProject;
}

function getTextColor(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function getTaskFromActiveProjects(user, taskId) {
    for (let project of user.projects) {
        if (project.isActive || project.title === "Default Project") {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) return task;
        }
    }
    return null;
}


export async function createProject(username, title, color) {
    const user = await getUser(username);
    if (!user) {
        throw new Error("User not found");
    }  
    const newProject = createProjectRepo(title, true, color);
    user.projects.push(newProject);
    
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}

export async function toggleProjectActive(username, projectId) {
    const user = await getUser(username);
    if (!user) {
        throw new Error("User not found");
    }
    const project = user.projects.find(p => p.id === projectId);
    if (!project) {
        throw new Error("Project not found");
    }
    // No permitir desactivar el default
    if (project.title === "Default Project") {
        throw new Error("Cannot deactivate default project");
    }
    project.isActive = !project.isActive;
    return await createOrUpdateOne(COLLECTION_USERS, username, user);
}    