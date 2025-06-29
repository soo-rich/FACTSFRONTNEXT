'use client';

import type { SessionProviderProps } from 'next-auth/react';

import { SessionProvider } from 'next-auth/react';

const NextAuthProvider = ({ children, ...rest }: SessionProviderProps) => {
  return <SessionProvider {...rest}>{children}</SessionProvider>;
};

export default NextAuthProvider;
