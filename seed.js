import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/user.js';
import Booking from './models/booking.js';
import redisClient, { connectRedis } from './utils/redisClient.js';

dotenv.config();

const seedData = async () => {
    try {
        // Connect to Databases
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");
        await connectRedis();
        console.log("Connected to Redis...");

        // Clear existing data
        await User.deleteMany({});
        await Booking.deleteMany({});
        try {
            await redisClient.del('drivers');
            const keys = await redisClient.keys('notifiedDrivers:*');
            if (keys.length > 0) await redisClient.del(keys);
            console.log("Cleared existing data.");
        } catch (err) {
            console.log("Redis clear skipped");
        }

        // --- SCENARIO 1: DELHI (Connaught Place) ---
        const delPassenger = await User.create({
            name: "Delhi Passenger",
            email: "passenger@uber.com",
            password: "password123",
            role: "passenger"
        });

        // --- SCENARIO 2: NOIDA (Sector 18) ---
        // Coords: 28.5355, 77.3910
        const noidaPassenger = await User.create({
            name: "Noida Passenger",
            email: "noida@uber.com",
            password: "password123",
            role: "passenger"
        });

        // --- SCENARIO 3: GURGAON (CyberHub) ---
        // Coords: 28.4595, 77.0266
        const gurgaonPassenger = await User.create({
            name: "Gurgaon Passenger",
            email: "gurgaon@uber.com",
            password: "password123",
            role: "passenger"
        });

        const driversToAdd = [
            // Noida Drivers (Close to 28.5355, 77.3910)
            { name: "Noida Driver 1", email: "ndriver1@uber.com", coords: [77.3910, 28.5355] },
            { name: "Noida Driver 2", email: "ndriver2@uber.com", coords: [77.4010, 28.5455] },
            { name: "Noida Driver 3", email: "ndriver3@uber.com", coords: [77.3810, 28.5255] },
            
            // Gurgaon Drivers (Close to 28.4595, 77.0266)
            { name: "Gurgaon Driver 1", email: "gdriver1@uber.com", coords: [77.0266, 28.4595] },
            { name: "Gurgaon Driver 2", email: "gdriver2@uber.com", coords: [77.0366, 28.4695] },
            { name: "Gurgaon Driver 3", email: "gdriver3@uber.com", coords: [77.0166, 28.4495] },

            // Delhi Drivers (Close to 28.6129, 77.2295)
            { name: "Delhi Driver 1", email: "driver1@uber.com", coords: [77.2295, 28.6129] },
            { name: "Delhi Driver 2", email: "driver2@uber.com", coords: [77.2395, 28.6229] }
        ];

        for (const data of driversToAdd) {
            const d = await User.create({
                name: data.name,
                email: data.email,
                password: "password123",
                role: "driver",
                location: { type: "Point", coordinates: data.coords }
            });

            await redisClient.sendCommand([
                'GEOADD',
                'drivers',
                data.coords[0].toString(),
                data.coords[1].toString(),
                d._id.toString()
            ]);
            console.log(`Seeded ${data.name} at [${data.coords}]`);
        }

        console.log("\n--- READY FOR TESTING ---");
        console.log("Noida Test: Login as noida@uber.com. Nearby: ndriver1, ndriver2, ndriver3");
        console.log("Gurgaon Test: Login as gurgaon@uber.com. Nearby: gdriver1, gdriver2, gdriver3");
        console.log("General Test: Login as passenger@uber.com. Nearby: driver1, driver2");
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seedData();
