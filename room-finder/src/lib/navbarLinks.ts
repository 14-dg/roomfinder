import type { AppRole } from "@/types/models";
import { Building2, ShieldCheck, Heart, BookOpenText, CircleUserRound, type LucideIcon, CalendarPlus } from "lucide-react";

const ACCESS_ALL: AppRole[] = ["guest", "student", "lecturer", "admin"];
const ACCESS_AUTH: AppRole[] = ["student", "lecturer", "admin"];
const ACCESS_STAFF: AppRole[] = ["lecturer", "admin"];
const ACCESS_ADMIN: AppRole[] = ["admin"];

export type NavBarLink = {
    path: string;
    name: string;
    icon: LucideIcon;
    allowedRoles: AppRole[];
};

export const navBarLinks: NavBarLink[] = [
    {
        path: "rooms",
        name: "Räume",
        icon: Building2,
        allowedRoles: ACCESS_ALL,
    },
    {
        path: "favorites",
        name: "Favoriten",
        icon: Heart,
        allowedRoles: ACCESS_AUTH,
    },
    {
        path: "lecturers",
        name: "Dozenten",
        icon: BookOpenText,
        allowedRoles: ACCESS_ALL,
    },
    {
        path: "bookings",
        name: "Buchungen",
        icon: CalendarPlus,
        allowedRoles: ACCESS_STAFF,
    },
    {
        path: "profile",
        name: "Profil",
        icon: CircleUserRound,
        allowedRoles: ACCESS_ALL,
    },
    {
        path: "admin",
        name: "Admin",
        icon: ShieldCheck,
        allowedRoles: ACCESS_ADMIN,
    }
];