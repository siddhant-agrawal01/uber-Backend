import client, { connectRedis } from "./redisClient.js";

async function start() {
    await connectRedis();

    await client.set("foo", "bar");

    const result = await client.get("foo");

    console.log(result);
}

start();