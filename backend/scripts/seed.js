import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting System Seeding Protcol...");

    const superAdminEmail = "superadmin@findash.io";
    const superAdminPass = process.env.SUPER_ADMIN_PASSWORD || "SuperSecret123!";

    const existing = await prisma.user.findUnique({
        where: { email: superAdminEmail }
    });

    if (existing) {
        console.log("⚠️  Super Admin identity already exists in this ledger.");
        return;
    }

    const hashedPassword = await bcrypt.hash(superAdminPass, 12);

    const superAdmin = await prisma.user.create({
        data: {
            name: "System Guardian",
            email: superAdminEmail,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            isEmailVerified: true,
            isActive: true,
        }
    });

    console.log("✅ SUPER_ADMIN successfully birthed in the infrastructure.");
    console.log(`📧 Email: ${superAdmin.email}`);
    console.log("🔑 Password: Provided in .env or default (SuperSecret123!)");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failure:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
