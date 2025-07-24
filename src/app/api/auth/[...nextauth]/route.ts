// @ts-nocheck;
import NextAuth from 'next-auth';import { authOptions } from '../../../../lib/auth';
// @ts-expect-error - NextAuth types are complex and may not match exactly;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export const dynamic = "force-dynamic";
