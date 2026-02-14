import { useState, useEffect } from 'react';

/**
 * Custom React hook for managing Progressive Web App (PWA) installation.
 * Listens for the browser's installation prompt and provides controls
 * to trigger and handle the PWA installation flow.
 * 
 * @returns Object containing:
 *   - isInstallable: Boolean indicating if app can be installed
 *   - handleInstallClick: Function to trigger installation prompt
 */
export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  /**
   * Effect hook that sets up listener for browser's beforeinstallprompt event.
   * This event fires when the browser detects the app meets PWA criteria.
   */
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the browser from showing its default installation banner
      e.preventDefault();
      // Store the event object for later use when user clicks install
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  /**
   * Handles the installation button click event.
   * Shows the browser's native installation dialog and processes user choice.
   */
  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Display the browser's installation prompt to the user
    installPrompt.prompt();

    // Wait for user to either accept or decline the installation
    const { outcome } = await installPrompt.userChoice;
    
    // Hide the install button if user accepts the installation
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    // Clear the saved prompt event after use
    setInstallPrompt(null);
  };

  return { isInstallable, handleInstallClick };
};