"use client";

import type { ThemeProviderProps } from "next-themes";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@heroui/toast";

import { ChildrenType } from "@/types/types";
import QueryProvider from "@/components/queryprovider/QueryProvider";
import NextAuthProvider from "@/components/nextauth/NextAuthProvider";

export interface ProvidersProps {
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

const ProvidersOwner = ({
  children,
  themeProps,
}: ChildrenType & ProvidersProps) => {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <NextAuthProvider>
          <QueryProvider>
            <ToastProvider
              placement={"top-center"}
              toastProps={{
                radius: "sm",
                variant: "solid",
                shouldShowTimeoutProgress: true,
                classNames: {
                  closeIcon:
                    "text-default-400 hover:text-primary hover:bg-default-100",
                },
              }}
            />
            {children}
          </QueryProvider>
        </NextAuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
};

export default ProvidersOwner;
