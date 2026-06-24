import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 4000,
  socketTimeoutMS: 4000,
};

const mockClient = {
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
};

// Use a lazy thenable object so that the MongoClient is only instantiated and connected to 
// when the promise is actually awaited inside a route handler (on-demand), rather than immediately 
// at module load/build compile time.
const clientPromise = {
  then(onFulfilled, onRejected) {
    if (!global._mongoClientPromise) {
      if (uri) {
        try {
          const client = new MongoClient(uri, options);
          global._mongoClientPromise = client.connect();
        } catch (err) {
          global._mongoClientPromise = Promise.reject(err);
        }
      } else {
        global._mongoClientPromise = Promise.resolve(mockClient);
      }
    }
    return global._mongoClientPromise.then(onFulfilled, onRejected);
  },
  catch(onRejected) {
    return this.then(null, onRejected);
  }
};

export default clientPromise;
