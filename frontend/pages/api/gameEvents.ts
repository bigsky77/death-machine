import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import NextCors from "nextjs-cors";
import { QueryError } from "../../../../types/backTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        gameComplete: object[];
      }
    | QueryError
  >
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  const {
    query: { since },
  } = req;

    const { db } = await connectToDatabase();
    const gameComplete = await db
          .collection("gameComplete_docs").find()
          .sort({
            '_chain.valid_from': -1 // prefer latest
            })
          .toArray()

    res.status(200).json({ 'gameComplete': gameComplete })
}
