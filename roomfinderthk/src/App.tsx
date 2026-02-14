import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

import AppRoutes from "@/AppRoutes";
import BottomNavigation from "@/components/BottomNavigation";
import { Toaster } from "@/components/ui/sonner";
import { FavoritesProvider } from "./contexts/FavoritesContext";

/**
 * Renders the authenticated app layout with all page content,
 * bottom navigation, and notification system.
 */
function AuthenticatedApp() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppRoutes />
      <BottomNavigation />
      <Toaster />
    </div>
  );
}

/**
 * Renders the unauthenticated app layout (login/register screens only).
 */
function UnauthenticatedApp() {
  return <AppRoutes />;
}

/**
 * Routes and renders appropriate app layout based on authentication status.
 * Shows loading state while auth status is being determined.
 */
function AppContent() {
  const { isAuthenticated, authReady } = useAuth();

  if (!authReady) {
    return <div className="p-8">Loading...</div>;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

/**
 * Root App component that provides global context providers.
 * Layers authentication, data, and favorites contexts for the entire application.
 */
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