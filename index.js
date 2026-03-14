import client, { connectRedis } from "./redisClient.js";

import cors from "cors"
import express from "express"

import mongoose from "mongoose"
import connectDB from "./utils/db.js";

import driverRoutes from "./routes/driverRoutes.js"
import passengerRoutes from "./routes/passengerRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"


dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.static('public'))


app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes(io))
app.use('/api/drivers', driverRoutes)
app.use('/api/passengers', passengerRoutes(io))
connectDB()
async function start() {
    await connectRedis();

    await client.set("foo", "bar");

    const result = await client.get("foo");

    console.log(result);
}

start();