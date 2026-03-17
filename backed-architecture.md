# Uber Backend System

A robust, real-time backend system for a ride-hailing application, built with Node.js, Express, MongoDB, Redis, and Socket.io. This system handles authentication, real-time driver tracking, passenger bookings, and nearby driver notifications using geospatial indexing.

---

## 🏗 System Architecture

The project follows a modular **Layered/MVC Pattern**:
- **Controllers**: Handle HTTP requests and orchestrate service calls.
- **Services**: Contain the core business logic (e.g., fare calculation, driver assignment).
- **Repositories**: Direct interaction with the database (MongoDB/Mongoose).
- **Models**: Define data schemas for MongoDB.
- **Utils**: Helper functions (e.g., distance calculations, database/redis connection).
- **Middlewares**: Process requests (e.g., authentication) before reaching controllers.
- **Real-time (Socket.io)**: Managed via event-driven communication for bidirectional updates.
- **Caching & Geospatial (Redis)**: Facilitates low-latency driver-socket mapping and proximity-based driver discovery.

---

## 🛠 Technology Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache & Geo-indexing**: Redis
- **Real-time Engine**: Socket.io
- **Security**: JWT for authentication, Bcrypt for password hashing

---

## 🔄 Backend Workflows

### 1. Authentication Flow
- **Registration**: Users register as either a `passenger` or a `driver`. Passwords are hashed using Bcrypt before storage.
- **Login**: Returns a JWT token for subsequent authenticated requests.

### 2. Driver Onboarding & Real-time Tracking
1. **Socket Connection**: When a driver connects, they emit a `registerDriver` event with their `driverId`.
2. **Socket-Redis Mapping**: The system stores the `driverId -> socketId` link in Redis for targeted notifications.
3. **Location Updates**: Drivers update their live coordinates via the `/api/drivers/location` endpoint. These are stored in Redis using `GEOADD` for efficient geospatial lookups.

### 3. Booking Lifecycle
1. **Creation**: A passenger sends a ride request (source & destination) to `/api/bookings`.
2. **Fare Calculation**: The `BookingService` uses the **Haversine formula** to calculate the distance and estimates the fare (Base Fare + Rate/km).
3. **Proximity Search**: System queries Redis using `GEORADIUS` to find drivers within a 5km radius of the pickup location.
4. **Notification**: 
   - Found drivers are notified in real-time via Socket.io (`newBooking` event).
   - The list of notified drivers is stored in a Redis Set linked to the `bookingId`.
5. **Acceptance**: 
   - A driver hits `/api/bookings/confirm`.
   - The system checks if the ride is still available, assigns the driver, and updates the status to `confirmed`.
   - Successful driver receives a `rideconfirmed` event.
   - Other notified drivers receive a `removeBooking` event to clear their UI.

---

## 🔌 API Documentation

### Auth APIs (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/register` | Register a new user (passenger/driver) |
| POST | `/login` | Authenticate and receive JWT |

### Passenger APIs (`/api/passengers`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/bookings` | Get all ride history for the passenger |
| POST | `/feedback` | Submit feedback/rating for a completed ride |

### Driver APIs (`/api/drivers`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/bookings` | Get list of assigned/past bookings |
| POST | `/location` | Update current coordinates (Latitude/Longitude) |

### Booking APIs (`/api/bookings`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/` | Create a new ride request (Source -> Destination) |
| POST | `/confirm` | Driver accepts a pending booking |

---

## 📡 Socket.io Events

### Client Emit (From User to Server)
- `registerDriver`: Sent by drivers on connection to link their Socket ID.

### Server Emit (From Server to User)
- `newBooking`: Sent to nearby drivers when a ride is requested.
- `rideconfirmed`: Sent to the driver who successfully accepts the ride.
- `removeBooking`: Sent to other notified drivers when a ride is no longer available.

---

## 📂 Project Structure

```text
├── controllers/      # Request handlers
├── middlewares/      # Auth & error handling
├── models/           # Mongoose schemas (User, Booking)
├── repositories/     # Database queries
├── routes/           # Express route definitions
├── services/         # Business logic & integrations
├── utils/            # DB, Redis & Math utilities
├── index.js          # Entry point (Server, Sockets, DB init)
└── .env              # Environment variables
```

---

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment**: Create a `.env` file with `PORT`, `MONGO_URI`, `REDIS_URL`, and `JWT_SECRET`.
4. **Run the server**:
   - Production: `npm start`
   - Development: `npm run dev`
