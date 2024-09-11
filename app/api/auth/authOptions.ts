import { NextAuthOptions } from "next-auth";
import {jwtDecode} from 'jwt-decode';
import KeycloakProvider from "next-auth/providers/keycloak"
type KeyCloakRoles = {
    realm_access: {
      roles: string[]
    }
  }
export const authOptions: NextAuthOptions = {
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
  
        const keyCloakRoles: KeyCloakRoles = jwtDecode(token.access_token as string)
  
          session.access_token = token.access_token
          session.id_token = token.id_token
          session.refresh_token = token.refresh_token
          session.roles = keyCloakRoles.realm_access.roles
        return session
      },
    },
  }