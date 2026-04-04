import prisma from "../config/db.js";

export const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;

        const records = await prisma.record.findMany({
            where: { userId, isDeleted: false },
            orderBy: { date: "desc" },
        });

        let totalIncome = 0;
        let totalExpense = 0;

        const categorySummary = {};
        const monthlySummary = {};

        records.forEach((r) => {
            const amount = r.amount;
            
            if (r.type === "INCOME") {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }

            if (!categorySummary[r.category]) {
                categorySummary[r.category] = { income: 0, expense: 0, total: 0 };
            }
            if (r.type === "INCOME") {
                categorySummary[r.category].income += amount;
            } else {
                categorySummary[r.category].expense += amount;
            }
            categorySummary[r.category].total += (r.type === "INCOME" ? amount : -amount);

            const dateObj = new Date(r.date);
            const monthName = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            if (!monthlySummary[monthName]) {
                monthlySummary[monthName] = { income: 0, expense: 0 };
            }
            if (r.type === "INCOME") {
                monthlySummary[monthName].income += amount;
            } else {
                monthlySummary[monthName].expense += amount;
            }
        });

        const categoryData = Object.keys(categorySummary).map((key) => ({
            category: key,
            ...categorySummary[key],
        }));

        const monthlyData = Object.keys(monthlySummary).map((key) => ({
            month: key,
            ...monthlySummary[key],
        })).reverse();

        res.json({
            success: true,
            data: {
                summary: {
                    totalIncome,
                    totalExpense,
                    balance: totalIncome - totalExpense,
                    transactionCount: records.length,
                },
                recentTransactions: records.slice(0, 5),
                categoryBreakdown: categoryData,
                monthlyTrends: monthlyData,
            }
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        res.status(500).json({ success: false, message: "Error generating analytics" });
    }
};