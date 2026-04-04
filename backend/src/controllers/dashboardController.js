import prisma from "../config/db.js";
import { subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, subDays } from 'date-fns';

export const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));

        // Fetch all non-deleted records for this user
        const records = await prisma.record.findMany({
            where: { userId, isDeleted: false },
            orderBy: { date: "desc" },
        });

        // 1. Calculate Monthly stats for % changes
        const currentMonthRecords = records.filter(r => new Date(r.date) >= startOfCurrentMonth);
        const lastMonthRecords = records.filter(r => {
            const d = new Date(r.date);
            return d >= startOfLastMonth && d <= endOfLastMonth;
        });

        const calcStats = (recs) => {
            let inc = 0, exp = 0;
            recs.forEach(r => {
                const isSalary = r.category.toLowerCase() === 'salary';
                if (isSalary || r.type === "INCOME") inc += r.amount;
                else exp += r.amount;
            });
            return { income: inc, expense: exp, balance: inc - exp };
        };

        const getPercentChange = (curr, prev) => {
            if (prev === 0) return null;
            return ((curr - prev) / prev) * 100;
        };

        // Calculate Global (All-time) Stats for the cards
        const overallStats = calcStats(records);
        const currentMonthStats = calcStats(currentMonthRecords);
        const lastMonthStats = calcStats(lastMonthRecords);

        const stats = {
            income: { 
                value: overallStats.income, 
                change: getPercentChange(currentMonthStats.income, lastMonthStats.income) 
            },
            expense: { 
                value: overallStats.expense, 
                change: getPercentChange(currentMonthStats.expense, lastMonthStats.expense) 
            },
            balance: { 
                value: overallStats.balance, 
                change: getPercentChange(currentMonthStats.balance, lastMonthStats.balance) 
            },
            activity: { 
                value: records.length, 
                change: getPercentChange(currentMonthRecords.length, lastMonthRecords.length) 
            }
        };

        // 2. Generate Daily Trends (Last 30 days)
        const dailyTrends = [];
        for (let i = 29; i >= 0; i--) {
            const d = subDays(now, i);
            const dateStr = format(d, 'yyyy-MM-dd');
            const dayLabel = format(d, 'MMM dd');
            const dayRecs = records.filter(r => format(new Date(r.date), 'yyyy-MM-dd') === dateStr);
            const dayStats = calcStats(dayRecs);
            dailyTrends.push({ date: dayLabel, ...dayStats });
        }

        // 3. Category Breakdown (Filtering out Salary from Expense category by type check)
        const categorySummary = {};
        records.forEach((r) => {
            if (!categorySummary[r.category]) {
                categorySummary[r.category] = { income: 0, expense: 0 };
            }
            if (r.type === "INCOME") categorySummary[r.category].income += r.amount;
            else categorySummary[r.category].expense += r.amount;
        });

        const categoryData = Object.keys(categorySummary).map((key) => ({
            category: key,
            ...categorySummary[key],
        }));

        // 4. Monthly Trends
        const monthlySummary = {};
        records.forEach(r => {
            const monthName = format(new Date(r.date), 'MMM yyyy');
            if (!monthlySummary[monthName]) monthlySummary[monthName] = { income: 0, expense: 0 };
            if (r.type === "INCOME") monthlySummary[monthName].income += r.amount;
            else monthlySummary[monthName].expense += r.amount;
        });

        const monthlyTrends = Object.keys(monthlySummary).map(m => ({ month: m, ...monthlySummary[m] })).reverse();

        res.json({
            success: true,
            data: {
                stats,
                dailyTrends,
                monthlyTrends,
                categoryBreakdown: categoryData,
                summary: {
                    totalIncome: records.reduce((s, r) => s + ((r.type === 'INCOME' || r.category.toLowerCase() === 'salary') ? r.amount : 0), 0),
                    totalExpense: records.reduce((s, r) => s + ((r.type === 'EXPENSE' && r.category.toLowerCase() !== 'salary') ? r.amount : 0), 0),
                    balance: records.reduce((s, r) => s + ((r.type === 'INCOME' || r.category.toLowerCase() === 'salary') ? r.amount : -r.amount), 0),
                    transactionCount: records.length
                }
            }
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        res.status(500).json({ success: false, message: "Error generating analytics" });
    }
};