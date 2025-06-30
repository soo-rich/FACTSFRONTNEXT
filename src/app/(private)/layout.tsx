import { AppSidebar } from "@/components/app-sidebar"
import AuthGuard from "@/components/auth/AuthGuard"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ChildrenType } from "@/types/types"

const PrivateLayout = ({ children }: ChildrenType) => {
    return (

        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">

                        <AuthGuard>
                            {children}
                        </AuthGuard>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default PrivateLayout