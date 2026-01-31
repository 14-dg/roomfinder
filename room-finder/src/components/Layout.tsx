import { Outlet } from "react-router-dom";
import { BottomNavigationBar } from "./BottomNavigationBar";

export function Layout() {
    return (
        <div>
            <main className="pb-20">
                <Outlet />
            </main>

            {/* Die Bottom Navigation Bar */}
            <BottomNavigationBar />
        </div>
    );
}