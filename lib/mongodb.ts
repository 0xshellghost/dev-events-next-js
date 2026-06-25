import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global interface to cache the Mongoose connection across hot reloads
 * in the Next.js development environment. This prevents multiple connections
 * and exhaustion of the database connection pool.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Ensure the global namespace is extended to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Retrieve the cached connection if it exists, otherwise initialize it
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to the MongoDB database using Mongoose.
 * It utilizes connection caching to reuse the existing connection in development.
 * 
 * @returns {Promise<Mongoose>} A promise that resolves to the Mongoose instance.
 */
async function connectToDatabase(): Promise<Mongoose> {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Return the active connection if it's already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection is currently being established, start a new one
  if (!cached.promise) {
    const opts = {
      // Disable mongoose buffering, requiring connection before operations
      bufferCommands: false,
    };

    // Initiate the connection and cache the promise
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  try {
    // Await the connection promise and store the established connection
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, clear the cached promise to allow retries
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
