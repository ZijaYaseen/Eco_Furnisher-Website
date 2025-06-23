import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const query = `*[_type == "user" && email == $email][0]`;
          const user = await client.fetch(query, { email: credentials.email });

          if (!user) {
            return null;
          }

          // Only check password for credentials users
          if (user.provider === "credentials") {
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);
            if (!passwordMatch) {
              return null;
            }
          }

          return {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role || "user", // Default to user if no role
            image: user.image,
          };
        } catch (error) {
          console.log("error",error);
          
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Google/Facebook login ke liye
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Check if user already exists
          const query = `*[_type == "user" && email == $email][0]`;
          const existingUser = await client.fetch(query, { email: user.email });

          if (!existingUser) {
            // Create new user in Sanity
            const newUser = {
              _type: "user",
              fullName: user.name || "User",
              email: user.email || "",
              image: user.image || "",
              provider: account.provider,
              providerId: user.id,
              emailVerified: new Date().toISOString(),
              role: "user", // Default role for new users
            };

            // Directly create user using Sanity client
            await client.create(newUser);
          }
          return true;
        } catch (error) {
          console.log("error",error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "user";
        token.id = user.id;
      }
      
      // For social login, fetch user role from Sanity if not in token
      if (account?.provider && !token.role) {
        try {
          const query = `*[_type == "user" && email == $email][0]`;
          const sanityUser = await client.fetch(query, { email: token.email });
          if (sanityUser) {
            token.role = sanityUser.role || "user";
            token.id = sanityUser._id;
          }
        } catch (error) {
          console.log("error",error);
          token.role = "user";
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role || "user";
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Dashboard pe redirect karein har successful auth ke baad
      if (url.startsWith("/Dashboard")) {
        return url;
      }
      // Default redirect to dashboard
      return `${baseUrl}/Dashboard`;
    },
  },
  pages: {
    signIn: "/Account/Login",
    signOut: "/",
    error: "/Account/Login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

export { handler as GET, handler as POST };