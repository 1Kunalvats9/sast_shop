// utils/client-checkRole.js
// This file is explicitly for Client Components only.
'use client'; // Mark this file as a Client Component

import { useUser } from '@clerk/nextjs';

export const useCheckRole = (role) => {
  const { user, isSignedIn } = useUser();
  if (!isSignedIn || !user) {
    return false;
  }
  return user.publicMetadata?.role === role;
};