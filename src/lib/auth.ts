import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Extend the built-in session types to carry role + permissions
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id:          string;
      role:        string;
      permissions: string[];
      name:        string;
      avatarUrl:   string;
    };
  }
  interface User {
    id:          string;
    role:        string;
    permissions: string[];
    name:        string;
    avatarUrl:   string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET ?? "fallback-secret-change-in-production",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email    = credentials?.email    as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        try {
          const { db } = await import("@/lib/db");

          // Look up the user in AdminUser table
          const user = await db.adminUser.findUnique({ where: { email } });

          // Fallback: if AdminUser table is empty (pre-migration), try the legacy path
          if (!user) {
            return legacyAuth(email, password);
          }

          if (!user.active) return null;

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;

          return {
            id:          user.id,
            email:       user.email,
            name:        user.name,
            avatarUrl:   user.avatarUrl,
            role:        user.role,
            permissions: user.permissions,
          };
        } catch {
          // DB unavailable — try legacy path
          return legacyAuth(email, password);
        }
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id;
        token.role        = (user as { role: string }).role        ?? "user";
        token.permissions = (user as { permissions: string[] }).permissions ?? [];
        token.name        = user.name        ?? "";
        token.avatarUrl   = (user as { avatarUrl: string }).avatarUrl ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id          = (token.id          as string) ?? "";
        session.user.role        = (token.role        as string) ?? "user";
        session.user.permissions = (token.permissions as string[]) ?? [];
        session.user.name        = (token.name        as string) ?? "";
        session.user.avatarUrl   = (token.avatarUrl   as string) ?? "";
      }
      return session;
    },
  },
});

/** Legacy auth — reads from ADMIN_EMAIL env var + content table hash.
 *  Used as fallback when AdminUser table hasn't been seeded yet. */
async function legacyAuth(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const envHash    = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || email !== adminEmail) return null;

  let adminHash = envHash ?? "";
  try {
    const { db } = await import("@/lib/db");
    const stored = await db.content.findUnique({ where: { key: "__admin_password_hash__" } });
    if (stored?.value) adminHash = stored.value;
  } catch {}

  if (!adminHash) return null;
  const valid = await bcrypt.compare(password, adminHash);
  if (!valid) return null;

  return {
    id:          "legacy-master",
    email,
    name:        "Admin",
    avatarUrl:   "",
    role:        "master",
    permissions: [] as string[],
  };
}
