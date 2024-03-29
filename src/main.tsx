import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App';
import { IonIcon } from '@ionic/react';
import { gridOutline, pieChartOutline, personOutline, logOutOutline } from 'ionicons/icons';
import Icon from './assets/images/icon.png';

// Load the custom elements
defineCustomElements(window);
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);