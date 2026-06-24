import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
};

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Fallback client for static compilation/build states where env variables are not present.
  // It resolves immediately to a mock database interface.
  clientPromise = Promise.resolve({
    db: () => ({
      collection: (name) => ({
        find: () => ({
          toArray: () => Promise.resolve([])
        }),
        findOne: () => Promise.resolve(null),
        updateOne: () => Promise.resolve({ acknowledged: true, modifiedCount: 1 }),
        insertOne: (doc) => Promise.resolve({ acknowledged: true, insertedId: doc._id || 'mock-id' }),
        deleteOne: () => Promise.resolve({ acknowledged: true, deletedCount: 1 }),
      })
    })
  });
}

export default clientPromise;
