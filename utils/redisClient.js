import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

export async function connectRedis() {
  await client.connect();
  console.log(" Redis connected");
}

export default client;