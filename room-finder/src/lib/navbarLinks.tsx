import { Building2, ShieldCheck, Heart, BookOpenText, CircleUserRound, type LucideIcon } from "lucide-react";

export type NavBarLink = {
    path: string;
    name: string;
    icon: LucideIcon;
};

export const navBarLinks: NavBarLink[] = [
    {
        path: "rooms",
        name: "Räume",
        icon: Building2,
    },
    {
        path: "favorites",
        name: "Favoriten",
        icon: Heart,
    },
    {
        path: "lecturers",
        name: "Dozenten",
        icon: BookOpenText,
    },
    {
        path: "profile",
        name: "Profil",
        icon: CircleUserRound,
    },
    {
        path: "admin",
        name: "Admin",
        icon: ShieldCheck,
    }
];