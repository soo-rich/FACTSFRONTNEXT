import {NavItem} from "@/types/menu/navigation.type";
import {
    BriefcaseBusiness,
    FileCheck2,
    FileClock,
    FilePen,
    FolderClosed,
    LayoutDashboard,
    Tags,
    UserCog
} from "lucide-react";

export const menu: NavItem[] = [
    {
        groupLabel: "Home",
        items: [
            {
                title: 'Tableau de bord',
                url: '/dashboard',
                icon: LayoutDashboard
            },
        ]
    },
    {
        groupLabel: "Dossier",
        items: [
            {
                title: 'Dossiers',
                icon: BriefcaseBusiness,
                isActive: true,
                items: [
                    {
                        title: 'Proforma',
                        url: '/proforma',
                        icon: FilePen
                    },
                    {
                        title: 'Borderau',
                        url: '/borderau',
                        icon: FileClock
                    },
                    {
                        title: 'Facture',
                        url: '/facture',
                        icon: FileCheck2
                    },

                ]
            }
        ]
    },
    {
        groupLabel: 'Client-Projet',
        items: [
            {
                title: 'Projet',
                url: '/projet',
                icon: FolderClosed
            },
            {
                title: 'Client',
                url: '/client',
                icon: UserCog
            }
        ]
    }, {
        groupLabel: 'Gestion des Articles',
        items: [
            {
                title: 'Articles',
                url: '/article',
                icon: Tags
            },

        ]
    }

];
