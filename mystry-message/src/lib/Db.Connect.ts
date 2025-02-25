import mongoose from "mongoose";

// Define DB connection state type
type DBConnectionState = {
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
        await mongoose.connect(process.env.MONGODB_URI || "", {});
        dbConnectionStatus.isConnected = mongoose.connections[0].readyState;
        console.log("DB connected successfully");
    } catch (error) {
        // Handle connection error
        console.error("DB connection failed:", error);
        process.exit(1);
    }
}

// Export connection function
export default connectToDatabase;