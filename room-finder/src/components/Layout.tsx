import { Outlet } from "react-router-dom";
import { BottomNavigationBar } from "./BottomNavigationBar";
import { TopBar } from "./TopBar";

export function Layout() {
    return (
        <div className="h-screen w-full bg-gray-50 text-gray-900 font-sans">
            {/* Die obere Leiste */}
            <TopBar />

            <main className="h-full overflow-y-auto py-16 container mx-auto max-w-screen">
                <Outlet />
            </main>

            {/* Die Bottom Navigation Bar */}
            <BottomNavigationBar />
        </div>
    );
}