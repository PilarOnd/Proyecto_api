import mongoose from "mongoose";
import dns from "node:dns";

export const connectMongo = async () => {
    try {
        // Some ISP routers reject SRV DNS queries used by mongodb+srv.
        // Force public resolvers so Atlas URIs work in Node as in Compass.
        dns.setServers(["8.8.8.8", "1.1.1.1"]);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log('Connected to MongoDB');
    }catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};