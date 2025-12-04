import { createOrUpdateOne, getOne, getAllFromCollection } from "../adapters/mongo.adapter.js";

const COLLECTION_USERS = "users";

// ================== Core DB Services for Users ====================== //

export async function getUser(userName) {
    const user = await getOne(COLLECTION_USERS, userName);
    return user;
}

export async function updateUser(userName, update) {
    return await createOrUpdateOne(COLLECTION_USERS, userName, update);
}

// ================== Advanced DB Services for Users ====================== //

// Create a new user
export async function createUser(user) {
    return await createOrUpdateOne(COLLECTION_USERS, user.username, user);
}

// Check if a username is already taken
export async function isUsernameAvailable(username) {
    const user = await getOne(COLLECTION_USERS, username);
    return user == null;
}

// Check if an email is already used by any user
export async function isEmailAvailable(email) {
    const query = { email: email };
    const users = await getAllFromCollection(COLLECTION_USERS);
    const emailUsed = users.find(u => u.email === email);
    return emailUsed == null;
}
