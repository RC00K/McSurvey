import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.mcsurvey',
  appName: 'mcsurvey',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
