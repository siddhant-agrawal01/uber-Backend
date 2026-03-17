# 🚖 Uber Backend System – Project Overview

Welcome to the core backend engine of the Uber Clone. This system is a high-performance, real-time platform designed to handle the complex orchestration of ride-hailing services, including user authentication, geospatial driver tracking, and instant booking management.

---

## 🌟 Key Features

- **🔐 Robust Authentication**: Secure JWT-based auth for both Passengers and Drivers with encrypted password storage.
- **📍 Real-time Tracking**: Live location updates and geospatial indexing using Redis for sub-millisecond proximity searches.
- **⚡ Instant Bookings**: Event-driven booking lifecycle powered by Socket.io, ensuring drivers and passengers stay synced.
- **🏎 Nearby Discovery**: Automated driver discovery within a 5km radius using the Haversine formula and Redis `GEO` commands.
- **📂 Clean Architecture**: Modular Layered Pattern (MVC-inspired) for high maintainability and scalability.

---

## 🛠 Technology Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | Node.js (v20+ recommended) |
| **Framework** | Express.js (v5.x) |
| **Primary Database** | MongoDB (Mongoose ODM) |
| **Caching & Geo-indexing** | Redis |
| **Real-time Engine** | Socket.io |
| **Security** | JWT (JSON Web Tokens) & Bcrypt |
| **Utilities** | Axios, Dotenv |

---

## 🏗 System Architecture

The project follows a **Layered Service Pattern** to separate concerns:

- **`controllers/`**: Entry points for HTTP requests. They validate input and delegate to services.
- **`services/`**: The "Brain" of the app. Contains business logic like fare calculation and driver matching.
- **`repositories/`**: Handles all direct database interactions (Mongoose queries).
- **`models/`**: Defines the data structure for Users, Bookings, and Reviews.
- **`middlewares/`**: Security guards (Auth checks, Error logging).
- **`utils/`**: Shared helpers (Database/Redis connection logic, Geolocation math).

---

## 🔄 Core Workflows

### 1. The Booking Handshake
1. **Request**: Passenger creates a booking via `/api/bookings`.
2. **Search**: Service finds nearby drivers using Redis GEORADIUS.
3. **Dispatch**: Socket.io broadcasts `newBooking` to all eligible drivers.
4. **Claim**: First driver to `confirm` gets the ride; others are notified to clear their UI.

### 2. Live Geospatial Updates
Drivers continuously push their coordinates. These are piped into **Redis**, allowing the system to maintain a real-time heatmap of available drivers without taxing the primary MongoDB database.

---

## 📡 API & Socket Interface

### Primary Endpoints
- `POST /api/auth/register` - User onboarding.
- `POST /api/bookings/` - Initializing a ride request.
- `POST /api/drivers/location` - Live location heartbeat.

### Real-time Events
- `registerDriver`: Connects a driver's unique ID to their active socket.
- `rideconfirmed`: Instant alert to driver upon successful booking match.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Running MongoDB instance (Atlas or Local)
- Running Redis instance

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd uber-Backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment Variables:**
   Create a `.env` file in the root:
   ```env
   PORT=2000
   MONGO_URI=your_mongodb_uri
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password
   JWT_SECRET=your_secret_key
   ```
4. **Launch:**
   - **Development**: `npm run dev` (with Nodemon)
   - **Production**: `npm start`

---

## 📂 Project Structure Snapshot
```text
├── controllers/      # Logic for handling requests
├── middlewares/      # Auth and safety layers
├── models/           # Database schemas
├── repositories/     # Data access layer
├── routes/           # Routing definitions
├── services/         # Core business logic
├── utils/            # Shared utilities (DB, Redis)
├── index.js          # Entry point
└── .env              # Configuration
```
