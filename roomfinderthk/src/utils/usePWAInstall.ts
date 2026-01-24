import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Verhindert den Standard-Banner des Browsers
      e.preventDefault();
      // Speichert das Event für später
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Zeigt den Installations-Dialog
    installPrompt.prompt();

    // Wartet auf die Entscheidung des Nutzers
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setInstallPrompt(null);
  };

  return { isInstallable, handleInstallClick };
};