import bcrypt from "bcrypt";
import { Admin } from "../models/admin.model.js";

export const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const fullName = process.env.ADMIN_FULLNAME || "System Admin";

    if (!email || !password) {
        console.log("Seed admin skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set");
        return;
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
        console.log("Admin already exists. Skipping seed.");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword, fullName });
    console.log(`Seeded admin ${email}`);
};


