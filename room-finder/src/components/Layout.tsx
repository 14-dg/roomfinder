import { Outlet } from "react-router-dom";
import { BottomNavigationBar } from "./BottomNavigationBar";
import { TopBar } from "./TopBar";

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Die obere Leiste */}
            <TopBar />

            <main className="pt-16 pb-20 container mx-auto max-w-md">
                <Outlet />
            </main>

            {/* Die Bottom Navigation Bar */}
            <BottomNavigationBar />
        </div>
    );
}