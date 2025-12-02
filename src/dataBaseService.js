import {getOne} from "./mongo.js";


const COLLECTION_USERS = "users";


export async function getUser(userName){
    const user = await getOne(COLLECTION_USERS, userName);
    return user;
}



