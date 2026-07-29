import { useEffect, useState } from 'react';

export default function StartupSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="app-startup-splash" aria-label="Opening Backlog Tracker">
      <img className="app-startup-splash-logo" src="/app_logo.png" alt="Backlog Tracker" />
      <span className="app-startup-splash-name">Backlog Tracker</span>
    </div>
  );
}
