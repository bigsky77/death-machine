import clientPromise from "../../lib/mongodb"
import { DB_NAME } from '../../src/constants/constants'


export default async function handler(req, res) {

    const client = await clientPromise

    const db = client.db("DeathMachine")
    const solutions = await db
          .collection("blockComplete_docs").find()
        // .find({
        //     instructions: {
        //         $not: { $size: 0 }
        //     },
        //     delivered: {
        //         $gte: 0
        //     }
        // })
         .sort({
             '_chain.valid_from': -1 // prefer latest
        })
        .toArray()

    res.status(200).json({ 'Block': solutions })
}
