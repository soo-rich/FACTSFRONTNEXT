import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import ProvidersOwner from "@/components/ProvidersOwner";
import { ThemeSwitch } from "@/components/theme-switch";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/identity_redim.ico",
    shortcut: "/identity_redim.ico",
    apple: "/identity_redim.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr">
      <head>
        <title />
      </head>
      <body
        className={clsx(
          "h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ProvidersOwner
          themeProps={{ attribute: "class", defaultTheme: "light" }}
        >
          {children}
          <div className={clsx("fixed bottom-4 right-4")}>
            <ThemeSwitch />
          </div>
        </ProvidersOwner>
      </body>
    </html>
  );
}
