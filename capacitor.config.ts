import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kalenderku.app',
  appName: 'Kalender Indonesia',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_calendar',
      iconColor: '#D97706',
      sound: 'beep.wav',
    }
  }
};

export default config;
