import { Building2, ShieldCheck, Heart, type LucideIcon } from "lucide-react";

export type NavBarLink = {
    path: string;
    name: string;
    icon: LucideIcon;
};

export const navBarLinks: NavBarLink[] = [
    {
        path: "/rooms",
        name: "Räume",
        icon: Building2,
    },
    {
        path: "/favourites",
        name: "Favoriten",
        icon: Heart,
    },
    {
        path: "/admin",
        name: "Admin",
        icon: ShieldCheck,
    }
];