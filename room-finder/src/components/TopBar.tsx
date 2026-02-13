import { Link, useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
    "/rooms": "Raumübersicht",
    "/rooms/details": "Raumdetails",
    "/favorites": "Meine Favoriten",
    "/lecturers": "Dozenten",
    "/lecturers/details": "Dozentendetails",
    "/bookings": "Buchungen",
    "/profile": "Mein Profil",
    "/admin": "Administration",

    "/login": "Anmelden",
};

export function TopBar() {

    const location = useLocation();
    const currentTitle = routeTitles[location.pathname] || "";
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white gap-2 border-b border-gray-200 z-40 flex items-center justify-between px-4 shadow-sm">

            <div className="z-10 flex-shrink-0">
                <Link
                    to="/"
                    className="flex items-center gap-3 transition-opacity"
                >
                    <img
                        src="/public/pwa-512x512.png"
                        alt="RoomFinder Logo"
                        className="h-12 w-12 rounded-3xl object-cover"
                    />
                    <h1
                        className="text-4xl font-bold text-gray-900 tracking-tight"
                    >
                        {"RoomFinder"}
                    </h1>
                </Link>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-lg font-bold text-gray-900 truncate px-12">
                    {currentTitle}
                </h1>
            </div>

        </header>
    );
}