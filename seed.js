import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/user.js';
import Booking from './models/booking.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await User.deleteMany({});
        await Booking.deleteMany({});
        console.log("Cleared existing Users and Bookings.");

        // Create Passengers
        const passengers = await User.create([
            {
                name: "John Passenger",
                email: "john@example.com",
                password: "password123",
                role: "passenger",
                location: { type: "Point", coordinates: [77.1025, 28.7041] } // Delhi
            },
            {
                name: "Jane Passenger",
                email: "jane@example.com",
                password: "password123",
                role: "passenger",
                location: { type: "Point", coordinates: [72.8777, 19.0760] } // Mumbai
            }
        ]);

        // Create Drivers
        const drivers = await User.create([
            {
                name: "Mike Driver",
                email: "mike@example.com",
                password: "password123",
                role: "driver",
                location: { type: "Point", coordinates: [77.1225, 28.7241] }
            },
            {
                name: "Sarah Driver",
                email: "sarah@example.com",
                password: "password123",
                role: "driver",
                location: { type: "Point", coordinates: [72.8977, 19.0960] }
            }
        ]);

        console.log("Created 2 Passengers and 2 Drivers.");

        // Create Bookings with different scenarios
        const bookings = await Booking.create([
            {
                passenger: passengers[0]._id,
                driver: drivers[0]._id,
                source: { latitude: 28.7041, longitude: 77.1025 },
                destination: { latitude: 28.8041, longitude: 77.2025 },
                fare: 250,
                status: "completed",
                rating: 5,
                feedback: "Excellent ride, very professional driver."
            },
            {
                passenger: passengers[1]._id,
                driver: drivers[1]._id,
                source: { latitude: 19.0760, longitude: 72.8777 },
                destination: { latitude: 19.1760, longitude: 72.9777 },
                fare: 450,
                status: "completed",
                rating: 4,
                feedback: "Good ride, but the route was a bit long."
            },
            {
                passenger: passengers[0]._id,
                driver: drivers[1]._id,
                source: { latitude: 28.7041, longitude: 77.1025 },
                destination: { latitude: 19.0760, longitude: 72.8777 },
                fare: 15000,
                status: "confirmed"
            },
            {
                passenger: passengers[1]._id,
                driver: null,
                source: { latitude: 19.0760, longitude: 72.8777 },
                destination: { latitude: 18.5204, longitude: 73.8567 }, // Pune
                fare: 3500,
                status: "pending"
            }
        ]);

        console.log("Created 4 Bookings (2 Completed, 1 Confirmed, 1 Pending).");
        console.log("Database Seeded Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();
