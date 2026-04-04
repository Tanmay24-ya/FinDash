import prisma from "../config/db.js";

export const createRecord = async (data, userId) => {
    return prisma.record.create({
        data: {
            ...data,
            userId,
        },
    });
};

export const getRecords = async (filters, userId) => {
    return prisma.record.findMany({
        where: {
            userId,
            type: filters.type,
            category: filters.category,
        },
        orderBy: { date: "desc" },
    });
};

export const updateRecord = async (id, data) => {
    return prisma.record.update({
        where: { id },
        data,
    });
};

export const deleteRecord = async (id) => {
    return prisma.record.delete({
        where: { id },
    });
};