import { PrismaClient } from "../../generated/prisma/client.ts";
const prisma = new PrismaClient();

export async function RoleSeed() {
        console.log("Seeding Roles...");
        const adminRole = await prisma.role.upsert({
            where: { code: "ADMIN" },
            update: {},
            create: {
                code: "ADMIN",
                description: "Administrator"
            }
        });
        const studentRole = await prisma.role.upsert({
            where: { code: "STUDENT" },
            update: {},
            create: {
                code: "STUDENT",
                description: "Student"
            }
        });
        return { adminRole, studentRole };
}