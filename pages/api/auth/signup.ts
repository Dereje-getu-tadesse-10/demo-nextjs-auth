import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json({ message: "Please Add a valid email address." });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (user) {
            return res
                .status(400)
                .json({ message: "This email address already exists." });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be atleast 6 characters." });
        }

        const cryptedPassword = await bcrypt.hash(password, 12);

        await prisma.user.create({
            data: {
                name,
                email,
                password: cryptedPassword,
            }
        })

        res.json({
            message: "User created successfully.",
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}