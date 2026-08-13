import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.debojitsantra.backlogtracker',
  appName: 'Backlog Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',

  },
  android: {
    backgroundColor: '#111318'
  },
  plugins: {
    LocalNotifications: {
      // Android renders status-bar notification icons as a monochrome mask.
      smallIcon: 'ic_stat_backlog',
      iconColor: '#6750A4'
    }
  }
};

export default config;
