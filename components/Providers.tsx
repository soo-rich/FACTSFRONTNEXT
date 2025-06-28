import {ChildrenType} from "@/types/types";
import {Toaster} from "@/components/ui/sonner";
import NextAuthProvider from "@/components/auth/NextAuthProvider";
import QueryProvider from "@/components/queryprovider/QueryProvider";
import {ThemeProvider} from "@/components/themes/themes-providers";

const Providers = ({children}: ChildrenType) => {
    return (
        <ThemeProvider enableSystem defaultTheme={'system'} attribute={'class'} disableTransitionOnChange={false}>
            <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
                <QueryProvider>
                    {children}
                    <Toaster expand={false} position="top-center" richColors={true} closeButton/>
                </QueryProvider>
            </NextAuthProvider>
        </ThemeProvider>
    );
};

export default Providers;
