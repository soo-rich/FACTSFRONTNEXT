import { ChildrenType } from "@/types/types";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/components/auth/NextAuthProvider";
import QueryProvider from "@/components/queryprovider/QueryProvider";

const Providers = ({ children }: ChildrenType) => {
  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <QueryProvider>
        {children}
        <Toaster expand={false} position="top-center" richColors={true} />
      </QueryProvider>
    </NextAuthProvider>
  );
};

export default Providers;
