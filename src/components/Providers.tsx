import {ChildrenType} from "@/types/types";
import NextAuthProvider from "@/components/auth/NextAuthProvider";
import QueryProvider from "@/components/queryprovider/QueryProvider";
import { Toaster } from "@/components/ui/sonner";


const Providers = ({children}: ChildrenType) => {
    return (
            <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
                <QueryProvider>
                    {children}
                    <Toaster expand={false} position="top-center" richColors={true} closeButton/>
                </QueryProvider>
            </NextAuthProvider>
    );
};

export default Providers;
