import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET ?? "fallback-secret-change-in-production",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const envHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail) return null;
        if (email !== adminEmail) return null;

        // [C7] Try DB-stored hash first (allows password change to take effect),
        // fall back to the environment variable hash if nothing is stored in DB.
        let adminHash = envHash ?? "";
        try {
          const { db } = await import("@/lib/db");
          const stored = await db.content.findUnique({
            where: { key: "__admin_password_hash__" },
          });
          if (stored?.value) adminHash = stored.value;
        } catch {
          // DB unavailable — fall through to env var hash
        }

        if (!adminHash) return null;

        const valid = await bcrypt.compare(password, adminHash);
        if (!valid) return null;

        return { id: "admin", email, name: "Admin" };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
