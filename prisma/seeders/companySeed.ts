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
            address: "https://www.google.com/maps?q=-6.909445,107.6264554&z=17&output=embed",
            capacity: 4,
            logo: "uploads/companyLogo/1770270198330_logo-react-icon.png"
        }
    });
    const company2 = await prisma.company.upsert({
        where: { name: "PT Wandra Mencari Cinta"},
        update: {},
        create: {
            name: "PT Wandra Mencari Cinta",
            description: "Perusahaan yang bergerak di bidang ilmu pra-nikah.",
            address: "https://www.google.com/maps?q=-6.9277992,107.6259379&z=15&output=embed",
            capacity: 10,
            logo: "uploads/companyLogo/1770260321244_logo-image.png"
        }
    });

    return { company1, company2 };
}