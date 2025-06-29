"use client";

import {ChevronRight} from "lucide-react";

import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {NavItem} from "@/types/menu/navigation.type";


const MenuGenerator = ({items}: { items: NavItem[] }) => {
    return (<>
        {
            items.map((navItem, index) => (
                <SidebarGroup key={index}>
                    {navItem.groupLabel && <SidebarGroupLabel className={'text-sm'}>{navItem.groupLabel}</SidebarGroupLabel>}
                    <SidebarMenu>{
                        navItem.items.map((item, index) => (
                            item.url ? (<SidebarMenuItem key={index}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link href={item.url}>
                                        {item.icon && <item.icon className="mr-2 h-4 w-4"/>}
                                        {item.title}

                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>) : (
                                <Collapsible key={index} asChild className="group/collapsible"
                                             defaultOpen={item.isActive}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon/>}
                                                <span>{item.title}</span>
                                                <ChevronRight
                                                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            {
                                                                subItem.url ?
                                                                    (
                                                                        <Link href={subItem.url}>
                                                                            {subItem.icon && <subItem.icon/>}
                                                                            <span>{subItem.title}</span>
                                                                        </Link>
                                                                    ) : (
                                                                        <>
                                                                            {subItem.icon && <subItem.icon/>}
                                                                            <span>{subItem.title}</span>
                                                                        </>

                                                                    )
                                                            }
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            )

                        ))
                    }</SidebarMenu>
                </SidebarGroup>
            ))
        }
    </>)


}

export default MenuGenerator;