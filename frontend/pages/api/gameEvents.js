import clientPromise from "../../lib/mongodb"
import { connectToDatabase } from "../../lib/mongodb"
import { DB_NAME } from '../../src/constants/constants'

export default async function handler(req, res) {

    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

    const solutions = await collection.find({})
        .sort({
            '_chain.valid_from': -1 // prefer latest
        })
        .toArray()

    res.status(200).json({ 'DeathMachine': solutions });
}
