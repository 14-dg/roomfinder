import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

import AppRoutes from "@/AppRoutes";
import BottomNavigation from "@/components/BottomNavigation";
import { Toaster } from "@/components/ui/sonner";
import { FavoritesProvider } from "./contexts/FavoritesContext";

function AuthenticatedApp() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppRoutes />
      <BottomNavigation />
      <Toaster />
    </div>
  );
}

function UnauthenticatedApp() {
  return <AppRoutes />;
}

function AppContent() {
  const { isAuthenticated, authReady } = useAuth();

  if (!authReady) {
    return <div className="p-8">Loading...</div>;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}


export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </DataProvider>
    </AuthProvider>
  );
}