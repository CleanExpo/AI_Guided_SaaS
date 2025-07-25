/* BREADCRUMB: unknown - Purpose to be determined */
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
declare module 'next-auth' {
  interface Session { user: {
      id: string,
  email: string,
  name: string;
  image? null : string
    } & DefaultSession['user']
  };
interface User extends DefaultUser  { id: string
}}
declare module 'next-auth/jwt' {
  interface JWT { id: string,
  email: string,
  name: string;
  picture? null : string
}
}