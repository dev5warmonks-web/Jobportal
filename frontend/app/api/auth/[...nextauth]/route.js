import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.emailOrPhone,
              mobile: credentials.emailOrPhone
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.user) {
            throw new Error(data.message || "Invalid login");
          }

          /// ---- Return user object to NextAuth ---- ///
          return {
            id: data.user._id,
            name: data.user.firstName,
            email: data.user.email,
            role: data.user.role,        // <-- important!
            token: data.token            // <-- your JWT
          };
        } catch (error) {
          console.error("Auth Error:", error);
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
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
