//* eslint-disable @typescript-eslint/ban-ts-comment */
import { Db, MongoClient } from "mongodb";

//const MONGO_CONNECTION_STRING = process.env.MONGODB_URI
//const MONGO_CONNECTION_STRING ="mongodb+srv://simon:deathmachine@deathmachine.s7yz0.mongodb.net/?retryWrites=true&w=majority";

const MONGO_CONNECTION_STRING ="mongodb+srv://vercel-admin-user:RkNxHuYi7ohpusIx@deathmachine.s7yz0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const uri = MONGO_CONNECTION_STRING;// process.env.NEXT_ATLAS_URI;

let client: MongoClient | undefined = undefined;
let db: Db | undefined = undefined;

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }
  if (process.env.NODE_ENV === "development") {
    // @ts-ignore
    if (!global._client) {
      client = await new MongoClient(uri as string).connect();
      // @ts-ignore
      global._client = client;
    } else {
      // @ts-ignore
      client = global._client;
    }
  } else {
    client = await new MongoClient(uri as string).connect();
  }
  db = (client as MongoClient).db("DeathMachine");
  return { client, db };
}
