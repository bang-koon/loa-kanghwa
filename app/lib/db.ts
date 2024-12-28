import { MongoClient, Db } from "mongodb";

const URI = process.env.DB_URI as string;
const options = {};

let dbPromise: Promise<Db>;

if (!URI) {
  throw new Error("Please add your Mongo URI");
}

function getDbPromise() {
  if (!dbPromise) {
    const client = new MongoClient(URI, options);
    dbPromise = client.connect().then(client => client.db("loakang"));
  }
  return dbPromise;
}

export default getDbPromise;
