import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    };

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB Connected Successfully");
      return mongoose;
    }).catch(err => {
      console.error("MongoDB Connection Error:", err.message);
      cached.promise = null; // Reset promise so we can retry
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset on failure
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
