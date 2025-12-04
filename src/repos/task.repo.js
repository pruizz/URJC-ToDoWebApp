import { generateUUID } from '../utils/uuid.utils.js';

export function createTask(title, description, dueDate, priority) {
    return {
        id: generateUUID(),
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        createdAt: new Date()
    };
}
