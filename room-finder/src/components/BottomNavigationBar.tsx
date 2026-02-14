import { NavLink } from "react-router-dom";
import { navBarLinks } from "@/lib/navbarLinks";
import { useAuth } from "@/hooks/auth/useAuth";

export function BottomNavigationBar() {

    const { role: userRole} = useAuth();

    const visibleNavBarLinks = navBarLinks.filter((link) => {
        return link.allowedRoles.includes(userRole);
    });

    //if(visibleNavBarLinks.length === 0) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-50 shadow-sm">
            <div className="flex justify-around items-center h-full max-w-lg mx-auto">

                {visibleNavBarLinks.map((link) => {
                    const IconComponent = link.icon;

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `
                            flex flex-col items-center justify-center w-full h-full space-y-1
                            ${isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`
                            }
                        >
                            <IconComponent size={24} strokeWidth={2} />
                            <span className="text-xs font-medium">{link.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}