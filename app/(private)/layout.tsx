import {ChildrenType} from "@/types/types";
import AuthGuard from "@/components/auth/AuthGuard";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {AdminHeader} from "@/components/shared/AdminHeader";

const PrivateLayout = ({children}: ChildrenType) => {
    return (<AuthGuard>
        <SidebarProvider style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }>
            <AppSidebar variant="inset"/>
            <SidebarInset>
                <AdminHeader/>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    </AuthGuard>);
};

export default PrivateLayout;
