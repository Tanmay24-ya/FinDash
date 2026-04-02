import prisma from "../config/db.js";

// CREATE RECORD
export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, note, date } = req.body;

        const record = await prisma.record.create({
            data: {
                amount,
                type,
                category,
                note,
                date: new Date(date),
                userId: req.user.userId,
            },
        });

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating record" });
    }
};

// GET ALL RECORDS
export const getRecords = async (req, res) => {
    try {
        const records = await prisma.record.findMany({
            where: { userId: req.user.userId },
            orderBy: { date: "desc" },
        });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching records" });
    }
};