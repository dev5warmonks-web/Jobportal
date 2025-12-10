import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { BASE_URL } from "../../../config/apiConfig";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}`}/api/users/login`;
          console.log('🔐 Attempting login to:', apiUrl);
          console.log('📧 Credentials:', { emailOrPhone: credentials.emailOrPhone });

          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.emailOrPhone,
              mobile: credentials.emailOrPhone
            }),
          });

          console.log('📡 Response status:', res.status);

          const data = await res.json();
          console.log('📦 Response data:', JSON.stringify(data, null, 2));

          if (!res.ok || !data.user) {
            console.error('❌ Login failed:', data.message || 'Invalid login');
            throw new Error(data.message || "Invalid login");
          }

          console.log('✅ Login successful for user:', data.user.email);

          /// ---- Return user object to NextAuth ---- ///
          return {
            id: data.user._id,
            name: data.user.firstName,
            email: data.user.email,
            role: data.user.role,        // <-- important!
            token: data.token            // <-- your JWT
          };
        } catch (error) {
          console.error("❌ Auth Error:", error.message);
          console.error("Full error:", error);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  // Store user + role + token inside JWT
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;     // <-- saved
        token.token = user.token;   // <-- backend JWT
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;   // <-- now available in frontend
      session.user.token = token.token;
      return session;
    },
  },

  pages: {
    signIn: "/",  // avoid redirect errors
    error: "/",   // redirect to home page on error instead of default error page
  },

  debug: true, // Enable debug mode to see detailed logs in Vercel
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
