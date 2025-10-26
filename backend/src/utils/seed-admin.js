import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Admin } from "../models/admin.model.js";
import { toAdminDto } from "../dto/admin.dto.js";
import connectDB from "../config/db.config.js";

const seedAdmin = async () => {
    try {
       await connectDB();
        
        const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

        if (admin) {
           console.log("Admin already exists");
           process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const newAdmin = await Admin.create({ fullName: process.env.ADMIN_FULLNAME, email: process.env.ADMIN_EMAIL, password: hashedPassword });

        const adminDto = toAdminDto(newAdmin);
        console.log({ message: "Admin created successfully", admin: adminDto });
        process.exit(0);
    } catch (error) {
        console.log(`Error seeding admin: ${error.message}`);
        process.exit(1);
    }
}

seedAdmin()