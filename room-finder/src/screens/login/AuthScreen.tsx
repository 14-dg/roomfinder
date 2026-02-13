import { supabase } from "@/lib/supabase";
import { AlertCircle, CheckCircle, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type AuthScreenType = "login" | "register";

export const AuthScreen = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [shownScreen, setShownScreen] = useState<AuthScreenType>("login");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [useWrongCredentials, setUseWrongCredentials] = useState<boolean>(false);

    const navigate = useNavigate();
    const location = useLocation();


    // Woher kam der User? (Smart Redirect)
    // Wenn er direkt auf /login gegangen ist, ist das Ziel "/"
    const from = location.state?.from?.pathname || "/";

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            if (shownScreen === "login") {
                //Login

                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                navigate(from, { replace: true });

            } else {
                //Registrierung

                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: "student",
                        }
                    },
                });

                if (error) throw error;

                if (data.session) {
                    // User ist direkt eingeloggt (Auto-Confirm an) nachdem er sich registriert hat
                    navigate(from, { replace: true });
                } else {
                    // User muss erst E-Mail bestätigen, wenn das Feature eingeschaltet ist
                    setSuccessMessage("Registrierung erfolgreich! Bitte überprüfe deine E-Mails in: " + email + ", um den Account zu bestätigen.");
                    setShownScreen("login"); // Wechsel zum Login-Screen
                }
            }
        }
        catch (error: unknown) {

            let errorMSG = "An Error Occured";

            if (error instanceof Error) errorMSG = error.message;

            if (errorMSG === "Invalid login credentials") {
                errorMSG = "Falsche E-Mail oder Passwort.";
                setUseWrongCredentials(true);
            }
            if (errorMSG.includes("already registered")) errorMSG = "Diese E-Mail ist bereits registriert.";
            if (errorMSG.includes("Password should contain at least one character of each")) errorMSG = "Das Passwort muss große und kleine Buchstaben, sowie mind. eine Zahl und mind. ein Sonderzeichen haben!"

            setErrorMessage(errorMSG);
        }

        finally {
            setIsLoading(false);
        }
    }


    return (
        <div>

            {/* Header */}
            <div>
                {
                    (shownScreen === "login") ? (
                        <>
                            <LogIn />
                            <p>
                                {"Willkommen!"}
                            </p>
                            <p>
                                {"Einloggen um fortzufahren"}
                            </p>
                        </>
                    ) : (
                        <>
                            <UserPlus />
                            <p>
                                {"Konto Erstellen"}
                            </p>
                        </>
                    )
                }
            </div>

            {/* Fehler */}
            {
                errorMessage && (
                    <div>
                        <AlertCircle />
                        {errorMessage}
                    </div>
                )
            }

            {/* Bestätigung */}
            {
                successMessage && (
                    <div>
                        <CheckCircle />
                        {successMessage}
                    </div>
                )
            }

            {/* Eingabe */}
            <div>
                <form onSubmit={handleAuth}>
                    <div>
                        <label>{"E-Mail Adresse:"}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="max_zweitname.mustermann@smail.th-koeln.de"
                        />
                    </div>
                    <div>
                        <label> {"Passwort:"}</label>
                        <input
                            type="password"
                            required
                            minLength={10}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="min. 10 Zeichen"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                        >
                            {
                                isLoading ? "Laden..." : (shownScreen === "login" ? "Anmelden" : "Registrieren")
                            }
                        </button>
                    </div>
                </form>
            </div>

            {/* Passwort vergessen */}
            {useWrongCredentials ??
                (
                    <div>

                    </div>
                )
            }

            {/* der button, um zwischen login und registrierung zu wechseln */}
            <div>
                <p>
                    {shownScreen === "login" ? "Noch kein Konto? " : "Bereits registriert? "}

                    <button
                        onClick={() => shownScreen === "login" ? setShownScreen("register") : setShownScreen("login")}
                    >
                        {shownScreen === "login" ? "Hier registrieren!" : "Hier anmelden!"}
                    </button>
                </p>
            </div>
        </div>
    );
};