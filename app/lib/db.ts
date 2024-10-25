// app/lib/mongodb.js
import { MongoClient } from "mongodb";

const URI = process.env.DB_URI as string;
const options = {};

let clientPromise: Promise<MongoClient>;

if (!URI) {
  throw new Error("Please add your Mongo URI");
}

function getClientPromise() {
  if (!clientPromise) {
    const client = new MongoClient(URI, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export default getClientPromise();
