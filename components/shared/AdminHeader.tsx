import NavigationPath from "@/components/paths/NavigationPath";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";

const AdminHeader = () => {
    return (
        <header
            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    className="mr-2 data-[orientation=vertical]:h-4"
                    orientation="vertical"
                />
                <NavigationPath/>
            </div>
        </header>
    );
};

export default AdminHeader;