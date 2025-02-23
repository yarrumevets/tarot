import mongodb from "mongodb";

// Connect to databases
const MongoClient = mongodb.MongoClient;
const mongoObjectId = mongodb.ObjectId;

const dbConnect = async (dbName) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB: ", error);
    throw new Error("Failed to connect to mongodb");
  }
};

const dbTarotai = await dbConnect("tarotai");

const getReadings = async (id) => {
  const readingsCollection = dbTarotai.collection("readings");
  const savedReadings = await readingsCollection.find({});
  return savedReadings;
};

const createReading = async (readingData) => {
  const readingsCollection = dbTarotai.collection("readings");
  const insertStatus = await readingsCollection.insertOne(readingData);
  return insertStatus;
};

export { createReading, getReadings };
