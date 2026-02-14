import { useAuth } from "@/hooks/auth/useAuth";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileScreen() {

    const { isAuthenticated, signOut } = useAuth();

    const navigate = useNavigate();

    const handleToLogin = () => {
        navigate("/login");
    }

    if (isAuthenticated) return (
        <div>
            <button
                onClick={signOut}
            >
                {"Abmelden"}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-500">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                <LogIn size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {"Nicht angemeldet."}
            </h2>
            <p className="max-w-sm mb-8 leading-relaxed">
                {"Melde dich an, um deinen persönlichen Stundenplan zu verwenden und Räume als Favoriten zu speichern."}
            </p>
            <button
                className="w-full max-w-sm bg-gradient-to-br from-orange-600 to-orange-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:from-orange-500 hover:to-orange-400 active:scale-95 transition-all"
                onClick={handleToLogin}
            >
                {"zum Login"}
            </button>
        </div>
    );
}