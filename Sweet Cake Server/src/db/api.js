import {connect} from "./index.js";

export const get = async (filename) => {
    try {
        const client = await connect()
        const db = client.db("sweet_cake");
        const result = db.collection(filename).find();
        const list = await result.toArray();
        return list;
    } catch (error) {
        return error
    }
}

export const update = async (filename,list) => {
    try {
        const client = await connect();
        const db = client.db("sweet_cake");
     
        await db.collection(filename).deleteMany({});
        if(list.length > 0) {
            await db.collection(filename).insertMany(list);
        }
    } catch (error) {
        console.log(error)
        throw(error)
    }
}

