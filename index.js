import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./utils/db.js";
import redisClient, { connectRedis } from "./utils/redisClient.js";

import authRoutes from "./routes/authRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";

import locationService from "./services/locationService.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/passengers', passengerRoutes);
// app.use('/api/bookings', bookingRoutes);

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('registerDriver', async (driverId) => {
    console.log(`Driver registered: ${driverId} with socket ${socket.id}`);
    socket.driverId = driverId; // Store driverId on socket for disconnect handling
    await locationService.setDriverSocket(driverId, socket.id);
  });

  socket.on('disconnect', async () => {
    console.log(`Socket disconnected: ${socket.id}`);
    if (socket.driverId) {
      await locationService.deleteDriverSocket(socket.driverId);
      console.log(`Driver socket deleted: ${socket.driverId}`);
    }
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();




// import client, { connectRedis } from "./utils/redisClient.js";

// import cors from "cors"
// import express from "express"

// import connectDB from "./utils/db.js";

// import driverRoutes from "./routes/driverRoutes.js"
// import passengerRoutes from "./routes/passengerRoutes.js"
// import authRoutes from "./routes/authRoutes.js"
// // import bookingRoutes from "./routes/bookingRoutes.js"
// import dotenv from "dotenv"

// import { socketIo } from "socket.io"
// import locationService from "./services/locationService.js"


// import { createServer } from "http";
// import redisClient from "./utils/redisClient.js";
// // import { Server } from "socket.io";




// dotenv.config();
// const httpServer = createServer();
// const io = new socketIo(httpServer, {
//   // options
//   cors: {
//     origin: "https://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   }
// });

// const app = express();

// app.use(cors())
// app.use(express.json());
// app.use(express.static('public'))


// app.use('/api/auth', authRoutes);
// // app.use('/api/bookings', bookingRoutes(io))
// // app.use('/api/bookings', bookingRoutes())
// app.use('/api/drivers', driverRoutes)
// app.use('/api/passengers', passengerRoutes)
// connectDB()
// async function start() {
//   await connectRedis();

//   await client.set("foo", "bar");

//   const result = await client.get("foo");

//   console.log(result);
// }

// start();

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`)
// })

// io.on('connection', (socket) => {
//   socket.on('registerDriver', async (driverId) => {
//     await locationService.setDriverSocket(driverId, socket.id)
//   })

//   socket.on('disconnect', async () => {
//     //finding that driver
//     const driverId = await locationService.getDriverSocket(`driver:${socket.id}`)
//     if (driverId) {
//       await locationService.deleteDriverSocket(`driver:${driverId}`)
//     }
//   })
// })

