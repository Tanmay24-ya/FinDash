import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../utils/schemas.js";

import crypto from 'crypto';

// REGISTER
export const register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // PUBLIC SIGNUP Logic: Force VIEWER and Unverified
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: "VIEWER",
                isEmailVerified: false,
                verificationToken: verificationToken,
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your identity.",
            data: { 
                ...userWithoutPassword,
                // In dev, we return the token so the UI can simulate the verify click
                dev_token: verificationToken 
            },
        });
    } catch (error) {
        if (error.name === "ZodError") return res.status(400).json({ success: false, errors: error.errors });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: "Token missing" });

        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

        // Progressive Escalation: Viewer -> Analyst on verification
        const updateData = {
            isEmailVerified: true,
            verificationToken: null,
        };

        if (user.role === 'VIEWER') {
            updateData.role = 'ANALYST';
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });

        // New JWT with upgraded role
        const newToken = jwt.sign(
            { userId: updatedUser.id, role: updatedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Identity verified! Account escalated to ANALYST status.",
            data: {
                token: newToken,
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    isEmailVerified: true
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isActive || user.isDeleted) {
            return res.status(403).json({ success: false, message: "User account deactivated" });
        }

        const isMatch = await bcrypt.compare(validatedData.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                }
            }
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        res.status(500).json({ success: false, message: "Login error" });
    }
};