import { toUserDto } from "../dto/user.dto.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {

        const { fullName, email, password, deviceId } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Decided to use bcrypt to hash the password instead of SHA512 which is vulnerable to rapid brute-force attacks due to its fast hashing speed.
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, password: hashedPassword, deviceId });

        const userDto = toUserDto(newUser);
        res.status(201).json({ message: "User created successfully", user: userDto });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error registering user: ${error.message}`);
        
    }

}