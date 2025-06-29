"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react";
import {getSession} from "next-auth/react";

import {NavMain} from "@/components/nav-main";
import {NavProjects} from "@/components/nav-projects";
import {NavUser} from "@/components/nav-user";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar";
import MenuGenerator from "./sidebarmenu/MenuGenerator";
import { menu } from "@/config/sidebarmenu";

// This is sample data.


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
