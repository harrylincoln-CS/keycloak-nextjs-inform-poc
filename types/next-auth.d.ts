import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    access_token?: string
    id_token?: string
    refresh_token?: string
    roles?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string
    id_token?: string
    refresh_token?: string
    access_token?: string
    expires_at?: number
  }
}
