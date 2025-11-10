import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { app } from "./src/app.js";
import connectDB from "./src/config/db.config.js";
import { client } from "./src/config/redis-client.config.js";
import { seedAdmin } from "./src/utils/seed-admin.js";

const PORT = process.env.PORT || 6000;

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  const redisClient = await client.connect();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
  });

  app.use(limiter);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
