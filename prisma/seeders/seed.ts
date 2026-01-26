import { PrismaClient } from '../../generated/prisma/client.ts';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Starting seeding process...');

        // type your seed here guys

        console.log('Seeding completed!');
    } catch (error) {
        console.error('Error during seeding: ', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();