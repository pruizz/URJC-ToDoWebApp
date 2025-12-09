
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config()

const uri = process.env.MONGO_DB_URI;

// ==================== MongoDB Setup ====================

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// ==================== Constants ====================

const DATABASE_NAME = 'web';

export const COLLECTIONS = {
    USERS: 'users',
};

// =================== Helpers Functions ====================

async function connect() {
    await client.connect();
    return client.db(DATABASE_NAME);
}


// =================== Main Functions ====================

export async function getAllFromCollection(collectionName) {
    const db = await connect();
    const collection = db.collection(collectionName);
    const results = await collection.find({}).toArray();
    return results;
}

export async function createOrUpdateOne(collectionName, username, data) {
    const db = await connect();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne({ username: username }, { $set: data }, { upsert: true });
    return await getOne(collectionName, username);
}

export async function getOne(collectionName, username){
    const db = await connect();
    const collection = db.collection(collectionName);
    const result = await collection.findOne({ username: username });
    return result;
}



