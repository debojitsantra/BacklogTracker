import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import appIcon from '../../assets/icon.svg';

export default function StartupSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  if (Capacitor.isNativePlatform() || !visible) return null;

  return (
    <div className="app-startup-splash" aria-label="Opening Backlog Tracker">
      <img className="app-startup-splash-logo" src={appIcon} alt="Backlog Tracker" />
      <span className="app-startup-splash-name">Backlog Tracker</span>
    </div>
  );
}
