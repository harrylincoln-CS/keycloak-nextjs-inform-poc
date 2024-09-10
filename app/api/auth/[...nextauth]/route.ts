import NextAuth, { AuthOptions } from "next-auth";
import {jwtDecode} from 'jwt-decode';
import KeycloakProvider from "next-auth/providers/keycloak"

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      console.log('callback invoked! token', token)
      const isProd = process.env.NODE_ENV === 'production'

      if (account) {
        token.provider = account.provider
        token.id_token = account.id_token
        token.refresh_token = account.refresh_token
        token.access_token = account.access_token
        token.expires_at = account.expires_at
      }

      return token
    },

    async session({ session, token }) {
        session.access_token = token.access_token
        session.id_token = token.id_token
        session.refresh_token = token.refresh_token
        session.roles = jwtDecode(token.access_token as string).realm_access.roles
        console.log('SESSION:', session, token)
      return session
    },
  },
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }