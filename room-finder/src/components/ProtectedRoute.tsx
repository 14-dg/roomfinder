import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import type { AppRole } from "@/types/models";

type Props = {
	allowedRoles: AppRole[];
};

const GoBack = () => {
	const navigate = useNavigate();

	useEffect(() => {

		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate("/", { replace: true });
		}
	}, [navigate]);

	return null;
};

export const ProtectedRoute = ({ allowedRoles }: Props) => {
	const { role, isLoading } = useAuth();

	//lade anzeige
	if (isLoading) {
		return <div className="h-screen w-full flex items-center justify-center">Laden...</div>;
	}

	/*
	unzureichende berechtigungen
	man bleibt wo man ist, oder geht auf "/",
	falls es ein neuer tab ist in dem direkt di url zur seite aufgerufen hat
	*/
	if (!allowedRoles.includes(role)) {
		return <GoBack />;
	}

	// Zeige inhalt an
	return <Outlet />;
};