import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Example user store
const users = [
  { id: 1, name: "MagicUser", email: "test@test.com", password: "123456" }
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const user = users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );
        return user || null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };