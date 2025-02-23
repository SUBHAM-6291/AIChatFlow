import mongoose from "mongoose";

type DBConnectionState = {
    isConnected?: number;
}

const dbConnectionStatus: DBConnectionState = {};

async function connectToDatabase(): Promise<void> {
    if (dbConnectionStatus.isConnected) {
        console.log("Already connected to the database.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || "", {});
        dbConnectionStatus.isConnected = mongoose.connections[0].readyState;
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

export default connectToDatabase;
