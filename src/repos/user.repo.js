import { createProject } from "./project.repo.js";

export function createUser(username, email, password, profile_photo = null) {
    const newProject = createProject("Default Project");
    
    return {
        username: username,
        email: email,
        password: password,
        badge: [],
        profile_photo: profile_photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        projects: [newProject],
        activeProject: newProject.id
    };
}