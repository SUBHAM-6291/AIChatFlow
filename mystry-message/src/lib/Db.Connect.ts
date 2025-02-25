import mongoose from "mongoose";

// Define DB connection state interface (prefer interface over type for this case)
interface DBConnectionState {
  isConnected?: number;
}

// Connection status object
const dbConnectionStatus: DBConnectionState = {};

async function connectToDatabase(): Promise<void> {
  console.log("Starting database connection process...");

  // Check existing connection
  if (dbConnectionStatus.isConnected) {
    console.log("Database connection already established with readyState:", dbConnectionStatus.isConnected);
    return;
  }

  try {
    // Retrieve and log the URI explicitly
    const uri = process.env.MONGODB_URI || "";
    console.log("Retrieved MONGODB_URI from environment:", uri ? uri.replace(/\/\/.*@/, "//[credentials]@") : "URI is empty or undefined");

    // Validate URI presence
    if (!uri) {
      console.error("No MONGODB_URI provided in environment variables!");
      throw new Error("MONGODB_URI is not defined");
    }

    // Log additional connection details
    const dbName = process.env.DB_NAME || "unknown";
    console.log("Preparing to connect with URI:", uri.replace(/\/\/.*@/, "//[credentials]@"));
    console.log("Target database name:", dbName);

    // Connect to MongoDB
    console.log("Initiating connection to MongoDB...");
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME, // Pass DB_NAME as an option
    });

    // Update and log connection status
    dbConnectionStatus.isConnected = mongoose.connections[0].readyState;
    console.log("Successfully connected to DB at URI:", uri.replace(/\/\/.*@/, "//[credentials]@"));
    console.log("Connection readyState:", dbConnectionStatus.isConnected);
  } catch (error) {
    // Handle connection error with detailed URI-related logging
    const uri = process.env.MONGODB_URI || "undefined";
    console.error("Failed to connect to DB at URI:", uri.replace(/\/\/.*@/, "//[credentials]@"));
    console.error("Connection error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    process.exit(1);
  }
}

// Export connection function
export default connectToDatabase;