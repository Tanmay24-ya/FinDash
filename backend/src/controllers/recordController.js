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

// GET ALL RECORDS (Hierarchical Oversight)
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
        
        const { userId, role } = req.user;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // SUPER_ADMIN sees EVERYTHING, others see their OWN
        const where = role === 'SUPER_ADMIN' ? { isDeleted: false } : { userId, isDeleted: false };

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
            // Include owner info for SuperAdmin
            include: role === 'SUPER_ADMIN' ? { user: { select: { name: true, email: true } } } : undefined
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
        const { userId, role } = req.user;
        const validatedData = updateRecordSchema.parse(req.body);

        const filter = role === 'SUPER_ADMIN' ? { id, isDeleted: false } : { id, userId, isDeleted: false };
        const record = await prisma.record.findFirst({ where: filter });

        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found or clearance insufficient" });
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
        const { userId, role } = req.user;

        const filter = role === 'SUPER_ADMIN' ? { id, isDeleted: false } : { id, userId, isDeleted: false };
        const record = await prisma.record.findFirst({ where: filter });

        if (!record) {
            return res.status(404).json({ success: false, message: "Record found or clearance insufficient" });
        }

        await prisma.record.update({
            where: { id },
            data: { isDeleted: true },
        });

        res.json({ success: true, message: "Record decommissioned successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting record" });
    }
};