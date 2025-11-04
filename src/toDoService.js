import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = getUsersPath();

let users = loadDataFromDisk();

let idTask = 0;


export function addUserTask(task, user) {

    task.completed = false;
    task.id = idTask++;
    user.tasks.push(task);
    saveDataToDisk();
}

export function deleteUserTask(id, user) {
    let i = -1;
    for (let j = 0; j < user.tasks.length; j++) {
        if (user.tasks[j].id === id) {
            i = j;
            break;
        }
    }
    let task = user.tasks.splice(i, 1)[0];
    saveDataToDisk();
    return task;
}

export function getAllTasks(user) {
    if (user) {
        return user.tasks;
    }else{
        return null;
    }
}

export function getOneTask(i, user) {
    return user.tasks[i];
}

export function addUser(user){
    users.set(user.username, user);
    saveDataToDisk();
    return user;
}

export function getUser(username) {
    return users.get(username);
}

export function deleteUser(username){
    users.delete(username);
    saveDataToDisk();
}

export function checkUserAvailable(username) {
    return !users.has(username);
}

export function checkEmailAvailable(email) {
    let result = true;
    for (let user of users.values()) {
        if (user.email === email) {
            result = false;
            break;
        }
    }
    return result;
}

export function checkUserPass(username, password) {
    let user = getUser(username);
    if (user && user.password === password){
        return user
    }else{
        return null
    }
}


export function saveDataToDisk() {
    const usersObj = Object.fromEntries(users); // convierte el Map en objeto
    const jsonData = JSON.stringify(usersObj, null, 4);
    fs.writeFileSync(getUsersPath(), jsonData, "utf8");
}

function getUsersPath() {
    const isDev = process.env.NODE_ENV === 'development' || process.defaultApp || !process.resourcesPath;
    const devPath = path.join(__dirname, 'users.json');

    if (isDev) return devPath;

    return path.join(process.resourcesPath, 'app', 'src', 'users.json');
}



export function loadDataFromDisk() {
    let data = fs.readFileSync(getUsersPath(), 'utf-8');
    let usersObj = JSON.parse(data);
    return new Map(Object.entries(usersObj));
}


