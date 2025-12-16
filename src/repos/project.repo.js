import { generateUUID } from "../utils/uuid.utils.js";


export function createProject(title, isActive = true, color = "#3CA6A6") {
    return {
        id: generateUUID(),
        title: title,
        tasks: [],
        isActive: isActive,
        color: color
    };
}