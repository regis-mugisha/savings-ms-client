import { createClient } from "redis";
import "dotenv/config";

export const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-15546.c256.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 15546,
  },
});
