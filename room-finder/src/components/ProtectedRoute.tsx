import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import type { AppRole } from "@/types/models";

type Props = {
  allowedRoles: AppRole[];
};

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { role, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAllowed = allowedRoles.includes(role);

  useEffect(() => {
    if (isAllowed) {
      sessionStorage.setItem("last_safe_route", location.pathname);
    }
  }, [isAuthenticated, isAllowed, location.pathname]);

  useEffect(() => {

    if (!isLoading && !isAllowed) {

      const lastSafeRoute = sessionStorage.getItem("last_safe_route");
      
      const target = lastSafeRoute || "/";
      
      navigate(target, { replace: true });
    }
  }, [isLoading, isAuthenticated, isAllowed, navigate]);


  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Laden...</div>;
  }

  if (isAllowed) {
    return <Outlet />;
  }

  return null;
};