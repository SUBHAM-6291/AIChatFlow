import mongoose from "mongoose";

// Define DB connection state interface (prefer interface over type for this case)
interface DBConnectionState {
  isConnected?: number;
}

// Connection status object
const dbConnectionStatus: DBConnectionState = {};

async function connectToDatabase(): Promise<void> {
  // Check existing connection
  if (dbConnectionStatus.isConnected) {
    console.log("Already connected to DB");
    return;
  }

  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || "";
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME, // Pass DB_NAME as an option
    });
    
    dbConnectionStatus.isConnected = mongoose.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    // Handle connection error with proper typing
    console.error("DB connection failed:", error as Error);
    process.exit(1);
  }
}

// Export connection function
export default connectToDatabase;