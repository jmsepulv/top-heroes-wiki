import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, WifiOff, CheckCircle2, Share2, PlusSquare } from 'lucide-react';
import { getPath } from '../utils/paths';

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already running as installed standalone PWA
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMode);

    // Check offline status
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if dismissed previously within 7 days
    try {
      const dismissedTime = localStorage.getItem('top_heroes_pwa_dismissed');
      if (dismissedTime && Date.now() - Number(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    } catch {
      // Ignore localStorage errors
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Catch Chrome/Android/Edge beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleOpenInstall = () => {
      setIsDismissed(false);
      setShowIosGuide(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('open-pwa-install', handleOpenInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleOpenInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('top_heroes_pwa_dismissed', Date.now().toString());
    } catch {
      // Ignore
    }
  };

  // If running as standalone app, only show offline banner when offline
  if (isStandalone) {
    if (!isOffline) return null;
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-slate-950 font-bold px-4 py-1.5 rounded-full shadow-lg text-xs flex items-center gap-2 backdrop-blur-md animate-fade-in">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Offline Mode Active — Cached Roster & Tools Available</span>
      </div>
    );
  }

  // If dismissed and online, render nothing
  if (isDismissed && !isOffline) {
    return null;
  }

  return (
    <>
      {/* Offline Toast Banner */}
      {isOffline && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500/95 text-slate-950 font-black px-4 py-1.5 rounded-full shadow-2xl text-xs flex items-center gap-2 backdrop-blur-md border border-amber-300">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are offline. Cached guides & roster builder remain functional.</span>
        </div>
      )}

      {/* Mobile / Desktop Install Prompt Floating Banner */}
      {(isInstallable || (isIOS && !isDismissed)) && !isDismissed && (
        <aside
          aria-label="PWA Installation Prompt"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-slate-900/95 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-slide-up"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-950 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src={getPath('/icons/icon.svg')}
                  alt="Top Heroes Icon"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Install Top Heroes App</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                    PWA
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  Instant offline access & full-screen roster tool
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500 font-medium">
              Free • Zero Storage Overhead
            </span>

            {isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            ) : isIOS ? (
              <button
                onClick={() => setShowIosGuide(!showIosGuide)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>How to Install</span>
              </button>
            ) : null}
          </div>

          {/* iOS Safari Installation Guide Accordion */}
          {showIosGuide && isIOS && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2">
              <div className="font-bold text-amber-400">Add to Home Screen on iOS Safari:</div>
              <ol className="space-y-1.5 list-decimal list-inside text-slate-400 text-[10px] leading-relaxed">
                <li className="flex items-center gap-1.5">
                  <span>1. Tap the</span>
                  <span className="inline-flex items-center gap-0.5 text-white font-semibold px-1 rounded bg-slate-800">
                    <Share2 className="w-3 h-3 text-blue-400" /> Share
                  </span>
                  <span>icon in Safari's toolbar.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>2. Scroll down and select</span>
                  <span className="inline-flex items-center gap-0.5 text-white font-semibold px-1 rounded bg-slate-800">
                    <PlusSquare className="w-3 h-3 text-amber-400" /> Add to Home Screen
                  </span>
                  <span>.</span>
                </li>
                <li>3. Tap <strong>Add</strong> in the top right corner.</li>
              </ol>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
