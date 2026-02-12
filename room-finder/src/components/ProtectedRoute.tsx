import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AppRole = 'admin' | 'lecturer' | 'student' | 'guest';

type Props = {
  allowedRoles?: AppRole[];
};

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { role, isLoading, session } = useAuth();

  if (isLoading) {
    return <div className="p-10">Lade Benutzerrechte...</div>;
  }

  // 1. Ist der User überhaupt eingeloggt?
  // Wenn nein -> Ab zum Login
  if (!session && !allowedRoles?.includes('guest')) {
    return <Navigate to="/login" replace />;
  }

  // 2. Hat der User die richtige Rolle?
  // Wenn allowedRoles leer ist, lassen wir jeden rein, der eingeloggt ist.
  // Wenn Rollen definiert sind, prüfen wir sie.
  if (allowedRoles && !allowedRoles.includes(role)) {
    // User ist eingeloggt, hat aber keine Rechte -> "Forbidden" oder Home
    return <div className="p-8 text-red-600">Zugriff verweigert. Du bist ein {role}.</div>;
    // Alternativ: return <Navigate to="/" replace />;
  }

  // Alles gut -> Zeige den Inhalt
  return <Outlet />;
};