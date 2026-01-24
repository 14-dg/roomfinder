import { User, LogOut, Download, Share } from "lucide-react"; // Download & Share hinzugefügt
import { Badge } from "@/components/ui/badge";
import { UserTimetable } from "@/components/UserTimetable";
import ScreenHeader from "@/components/ScreenHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { usePWAInstall } from "@/utils/usePWAInstall"; 

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { lecturers } = useData();
  const { isInstallable, handleInstallClick } = usePWAInstall();

  // iOS Check für manuelle Anleitung
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <ScreenHeader title="Profile" />
      <div className="px-4 py-6 space-y-4">
        {/* User Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <Badge
                className="mt-2 capitalize"
                variant={user.role === "admin" ? "default" : "secondary"}
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* --- PWA INSTALL SECTION --- */}
        {isInstallable && (
          <button
            onClick={handleInstallClick}
            className="w-full flex items-center justify-between bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition-all animate-in fade-in slide-in-from-top-4"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">App installieren</p>
                <p className="text-xs text-blue-100">Schnellerer Zugriff auf freie Räume</p>
              </div>
            </div>
          </button>
        )}

        {/* iOS spezifischer Hinweis (da beforeinstallprompt dort nicht geht) */}
        {isIOS && !isStandalone && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
            <Share className="w-5 h-5 text-amber-600 mt-1" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold">App auf dem iPhone nutzen:</p>
              <p>Tippe auf <span className="font-bold">Teilen</span> und dann auf <span className="font-bold">"Zum Home-Bildschirm"</span>.</p>
            </div>
          </div>
        )}
        {/* --------------------------- */}

        {/* Timetable */}
        <UserTimetable />

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm divide-y">
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <p className="text-base">Notification Settings</p>
            <p className="text-sm text-gray-600 mt-1">Manage your alerts</p>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <p className="text-base">Default Filters</p>
            <p className="text-sm text-gray-600 mt-1">Set your preferred filters</p>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <p className="text-base">About</p>
            <p className="text-sm text-gray-600 mt-1">Version 1.0.0</p>
          </button>
          <button
            onClick={logout}
            className="w-full px-6 py-4 text-left text-red-600 font-medium"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </div>
          </button>
        </div>
      </div>
    </>
  );
}