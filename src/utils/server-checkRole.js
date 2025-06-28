// utils/server-checkRole.js
// This file is explicitly for Server Components only.
import { auth } from '@clerk/nextjs/server';

export const checkRole = (role) => {
  const { sessionClaims } = auth();
  return sessionClaims?.public_metadata?.role === role;
};