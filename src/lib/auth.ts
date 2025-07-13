import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import type { User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { AdapterUser } from 'next-auth/adapters'

// NextAuth type definitions
interface ExtendedUser extends User {
  id: string
}

interface Account {
  provider: string
  providerAccountId: string
  type: string
  access_token?: string
  refresh_token?: string
  expires_at?: number
}

interface Profile {
  sub?: string
  name?: string
  email?: string
  picture?: string
}

interface JWTCallbackParams {
  token: JWT
  user?: ExtendedUser | AdapterUser
  account?: Account | null
  profile?: Profile | undefined
  trigger?: 'signIn' | 'signUp' | 'update' | undefined
  isNewUser?: boolean | undefined
  session?: {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
    expires: string
  }
}

interface SessionCallbackParams {
  session: {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
    expires: string
  }
  token: JWT
  user: AdapterUser
  newSession?: {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
    expires: string
  }
  trigger?: 'update'
}

interface SignInCallbackParams {
  user: ExtendedUser | AdapterUser
  account: Account | null
  profile?: Profile | undefined
  email?: {
    verificationRequest?: boolean
  }
  credentials?: Record<string, string>
}

// Handle missing environment variables gracefully for demo deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password || !supabase) {
          return null
        }

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          image: user.avatar_url,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: JWTCallbackParams) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: SessionCallbackParams) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account }: SignInCallbackParams) {
      if (account?.provider === 'google' && supabase) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          const { error } = await supabase
            .from('users')
            .insert({
              email: user.email,
              full_name: user.name,
              avatar_url: user.image,
              provider: 'google',
              provider_id: account.providerAccountId,
            })

          if (error) {
            console.error('Error creating user:', error)
            return false
          }
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
