import { Outlet } from "react-router-dom";
import { BottomNavigationBar } from "./BottomNavigationBar";
import { TopBar } from "./TopBar";

export function Layout() {
    return (
        <div className="min-h-full bg-gray-50 text-gray-900 font-sans">
            {/* Die obere Leiste */}
            <TopBar />

            <main className="container mx-auto my-16 max-w-full min-h-[calc(100vh-8rem)]">
                <Outlet />
            </main>

            {/* Die Bottom Navigation Bar */}
            <BottomNavigationBar />
        </div>
    );
}