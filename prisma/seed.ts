import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create default admin user
  const username = 'ghadeer';
  const password = 'welcome@1';
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username }
  });

  if (existingUser) {
    console.log(`User '${username}' already exists. Skipping...`);
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    console.log(`✓ Created default admin user: ${user.username} (ID: ${user.id})`);
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

