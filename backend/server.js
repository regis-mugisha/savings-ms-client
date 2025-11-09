import { app } from "./src/app.js";
import connectDB from "./src/config/db.config.js";
import { seedAdmin } from "./src/utils/seed-admin.js";

const PORT = process.env.PORT || 6000;

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
