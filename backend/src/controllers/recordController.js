import prisma from "../config/db.js";
import { recordSchema, updateRecordSchema } from "../utils/schemas.js";

// CREATE RECORD
export const createRecord = async (req, res) => {
    try {
        const validatedData = recordSchema.parse(req.body);

        const record = await prisma.record.create({
            data: {
                ...validatedData,
                date: new Date(validatedData.date),
                userId: req.user.userId,
            },
        });

        res.status(201).json({ success: true, data: record });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        res.status(500).json({ success: false, message: "Error creating record" });
    }
};

// GET ALL RECORDS (PAGINATION, SEARCH, FILTERS)
export const getRecords = async (req, res) => {
    try {
        const { 
          type, 
          category, 
          startDate, 
          endDate, 
          search, 
          page = 1, 
          limit = 10 
        } = req.query;
        
        const userId = req.user.userId;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = { 
          userId,
          isDeleted: false 
        };

        if (type) where.type = type;
        if (category) where.category = category;
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        if (search) {
          where.OR = [
            { category: { contains: search, mode: 'insensitive' } },
            { note: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [records, totalCount] = await Promise.all([
          prisma.record.findMany({
            where,
            orderBy: { date: "desc" },
            skip,
            take,
          }),
          prisma.record.count({ where })
        ]);

        res.json({
          success: true,
          data: records,
          pagination: {
            totalCount,
            totalPages: Math.ceil(totalCount / take),
            currentPage: parseInt(page),
            pageSize: take
          }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching records" });
    }
};

// UPDATE RECORD
export const updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateRecordSchema.parse(req.body);

        const record = await prisma.record.findFirst({
            where: { id, userId: req.user.userId, isDeleted: false },
        });

        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        const updated = await prisma.record.update({
            where: { id },
            data: {
                ...validatedData,
                date: validatedData.date ? new Date(validatedData.date) : undefined,
            },
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        res.status(500).json({ success: false, message: "Error updating record" });
    }
};

// SOFT DELETE RECORD
export const deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await prisma.record.findFirst({
            where: { id, userId: req.user.userId, isDeleted: false },
        });

        if (!record) {
            return res.status(404).json({ success: false, message: "Record found or access denied" });
        }

        await prisma.record.update({
            where: { id },
            data: { isDeleted: true },
        });

        res.json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting record" });
    }
};