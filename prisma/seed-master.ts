/**
 * One-time seed: creates the master AdminUser from the existing ADMIN_EMAIL
 * and ADMIN_PASSWORD_HASH env vars so login still works after migration.
 *
 * Run once:
 *   npx tsx prisma/seed-master.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const hash  = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !hash) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in .env.local");
    process.exit(1);
  }

  // Check if master already exists
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Master user already exists: ${email}`);
    await db.$disconnect();
    return;
  }

  // Also check if there is a stored hash in the content table (from password-change)
  let finalHash = hash;
  try {
    const stored = await db.content.findUnique({ where: { key: "__admin_password_hash__" } });
    if (stored?.value) finalHash = stored.value;
  } catch {}

  const user = await db.adminUser.create({
    data: {
      email,
      name:         "Shelvey Dias",
      avatarUrl:    "",
      passwordHash: finalHash,
      role:         "master",
      permissions:  [],
      active:       true,
    },
  });

  console.log(`✅ Master user created: ${user.email} (id: ${user.id})`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
