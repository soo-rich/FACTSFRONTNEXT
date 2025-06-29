"use client";

import { getSession } from "next-auth/react";
import * as React from "react";
import { useEffect, useState } from "react";

import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar";
import { menu } from "@/config/sidebarmenu";
import MenuGenerator from "./sidebarmenu/MenuGenerator";


export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = useState<{
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }>();

    const getUserConnect = async () => {
        setUser((await getSession())?.user);
    };


    useEffect(() => {
        getUserConnect().then(() => true)
    }, []);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavUser dropdown={false}/>
            </SidebarHeader>
            <SidebarContent>
                <MenuGenerator items={menu}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}
