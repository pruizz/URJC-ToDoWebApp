
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://tachaobusiness_db_user:DhIv2Sm3h2DaYRFa@cluster0.mennvlx.mongodb.net/?appName=Cluster0";


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

export async function createOrUpdateOne(collectionName, id, data) {
    const db = await connect();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne({ _id: id }, { $set: data }, { upsert: true });
    console.log(result);
    return result;
}

export async function getOne(collectionName, id){
    const db = await connect();
    const collection = db.collection(collectionName);
    const result = await collection.findOne({ _id: id });
    console.log(result);
    return result;
}



