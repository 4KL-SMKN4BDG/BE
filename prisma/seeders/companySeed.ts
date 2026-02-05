import { PrismaClient } from "../../generated/prisma/client.ts";
const prisma = new PrismaClient();

export async function CompanySeed() {
    console.log("Seeding Companies...");
    const company1 = await prisma.company.upsert({
        where: { name: "PT Mughni Sejahtera"},
        update: {},
        create: {
            name: "PT Mughni Sejahtera",
            description: "Perusahaan yang bergerak di bidang teknologi informasi.",
            address: "JL. Soekarno Hatta No.123, Bandung",
            capacity: 4
        }
    });
    const company2 = await prisma.company.upsert({
        where: { name: "PT Wandra Mencari Cinta"},
        update: {},
        create: {
            name: "PT Wandra Mencari Cinta",
            description: "Perusahaan yang bergerak di bidang ilmu pra-nikah.",
            address: "JL. Soeka Kamu No.123, Bandung",
            capacity: 10
        }
    });

    return { company1, company2 };
}