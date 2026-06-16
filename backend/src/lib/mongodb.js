import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI não definida");
}

let cached = globalThis._mongoose ?? {
  conn: null,
  promise: null,
};

globalThis._mongoose = cached;

export async function connectDB() {
  console.log("ENTROU NA CONNECTDB");
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("Tentando conectar ao MongoDB...");

      cached.promise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
    }

    cached.conn = await cached.promise;

    console.log("🟢 MongoDB conectado!");

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("🔴 Erro MongoDB:", error);

    throw error;
  }
}
