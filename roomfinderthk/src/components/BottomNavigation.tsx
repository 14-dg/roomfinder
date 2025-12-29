import { Home, Heart, UserSearch, BookOpen, Calendar, User, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex items-center justify-around h-16">

        <NavItem
          label="Rooms"
          icon={<Home className="w-6 h-6" />}
          active={isActive("/rooms")}
          onClick={() => navigate("/rooms")}
        />

        <NavItem
          label="Favorites"
          icon={<Heart className="w-6 h-6" />}
          active={isActive("/favorites")}
          badge={favorites.length}
          onClick={() => navigate("/favorites")}
        />

        <NavItem
          label="Professor"
          icon={<UserSearch className="w-6 h-6" />}
          active={isActive("/professors")}
          onClick={() => navigate("/professors")}
        />

        <NavItem
          label="Classes"
          icon={<BookOpen className="w-6 h-6" />}
          active={isActive("/classes")}
          onClick={() => navigate("/classes")}
        />

        {user?.role === "professor" && (
          <NavItem
            label="Book"
            icon={<Calendar className="w-6 h-6" />}
            active={isActive("/booking")}
            onClick={() => navigate("/booking")}
          />
        )}

        <NavItem
          label="Profile"
          icon={<User className="w-6 h-6" />}
          active={isActive("/profile")}
          onClick={() => navigate("/profile")}
        />

        {user?.role === "admin" && (
          <NavItem
            label="Admin"
            icon={<Shield className="w-6 h-6" />}
            active={isActive("/admin")}
            onClick={() => navigate("/admin")}
          />
        )}

      </div>
    </nav>
  );
};

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem = ({ label, icon, active, onClick, badge }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${
        active ? "text-blue-600" : "text-gray-600"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>

      {badge && badge > 0 && (
        <Badge className="absolute top-1 right-1/4 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {badge}
        </Badge>
      )}
    </button>
  );
};


export default BottomNavigation;
