import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectToDatabase(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }

  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: process.env.DB_NAME,
    });
    connection.isConnected = dbConnect.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
}

export default connectToDatabase;