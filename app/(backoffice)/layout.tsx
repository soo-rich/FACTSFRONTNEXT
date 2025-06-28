import { Metadata } from "next";

import { ChildrenType } from "@/types/types";
import AuthGuard from "@/components/nextauth/AuthGuard";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Administration",
};
const BackOfficeLayout = ({ children }: ChildrenType) => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default BackOfficeLayout;
