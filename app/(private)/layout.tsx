import {ChildrenType} from "@/types/types";
import AuthGuard from "@/components/auth/AuthGuard";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import NavigationPath from "@/components/paths/NavigationPath";

const PrivateLayout = ({ children }: ChildrenType) => {
  return( <AuthGuard>
    <SidebarProvider style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
        <AppSidebar variant="inset"/>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                  className="mr-2 data-[orientation=vertical]:h-4"
                  orientation="vertical"
              />
              <NavigationPath/>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
 </AuthGuard>);
};

export default PrivateLayout;
