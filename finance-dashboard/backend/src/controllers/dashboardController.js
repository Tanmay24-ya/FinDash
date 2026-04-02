import prisma from "../config/db.js";

export const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        const records = await prisma.record.findMany({
            where: { userId },
        });

        let totalIncome = 0;
        let totalExpense = 0;

        records.forEach((r) => {
            if (r.type === "INCOME") totalIncome += r.amount;
            else totalExpense += r.amount;
        });

        res.json({
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            totalTransactions: records.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard" });
    }
};