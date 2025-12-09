import { generateUUID } from "../utils/uuid.utils.js";


export function createProject(title) {
    return {
        id: generateUUID(),
        title: title,
        tasks: []
    };
}