import { ChildrenType } from '@/types/types';

import NextAuthProvider from '@/components/auth/NextAuthProvider';
import QueryProvider from '@/components/queryprovider/QueryProvider';

const Providers = ({ children }: ChildrenType) => {
  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <QueryProvider>{children}</QueryProvider>
    </NextAuthProvider>
  );
};

export default Providers;
