'use client';
import QueryProvider from '@/components/queryclient/QueryProvider';
import NextAuthProvider from '@/context/nextAuthProvider';
import { ChildrenType } from '@/types/types';
import { HeroUIProvider } from '@heroui/react';

const Providers = async ({ children }: ChildrenType) => {
  return (
    <NextAuthProvider>
      <QueryProvider>
        <HeroUIProvider>{children}</HeroUIProvider>
      </QueryProvider>
    </NextAuthProvider>
  );
};

export default Providers;
