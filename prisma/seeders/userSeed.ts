import { PrismaClient, type Role } from "../../generated/prisma/client.ts";
const prisma = new PrismaClient();

export async function UserSeed(adminRole: Role, studentRole: Role) {
        console.log("Seeding Users...");
        const admin1 = await prisma.user.upsert({
            where: { email: "admin@smkn4.com" },
            update: {},
            create: {
                name: "Zico Oktorachman",
                email: "admin@smkn4.com",
                password: "password123",
                roles: {
                    connect: { id: adminRole.id }
                }
            }
        });
        const student1 = await prisma.user.upsert({
            where: { email: "student@smkn4.com" },
            update: {},
            create: {
                name: "Wandra Danurwenda",
                email: "student@smkn4.com",
                password: "password123",
                roles: {
                    connect: { id: studentRole.id }
                }
            }
        });
        return { admin1, student1 };
}