import { PrismaClient } from '../../generated/prisma/client.ts';
const prisma = new PrismaClient();

import { RoleSeed } from './roleSeed.ts';
import { UserSeed } from './userSeed.ts';
import { CompanySeed } from './companySeed.ts';

async function main() {
    try {
        console.log('Starting seeding process...');

        const { adminRole, studentRole } = await RoleSeed();
        const { admin1, student1 } = await UserSeed(adminRole, studentRole);
        const company = await CompanySeed();

        console.log('Seeding completed!');
    } catch (error) {
        console.error('Error during seeding: ', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();