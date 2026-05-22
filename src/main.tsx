import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@prasheel/ui';
import { AppProvider } from './state/store';
import { App } from './App';
import '@prasheel/ui/styles.css';
import './index.css';

const themeStorageKeys = {
  themeId: 'buying-decision-maker:theme-id',
  colorMode: 'buying-decision-maker:color-mode',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      defaultThemeId="blue"
      storageKeys={themeStorageKeys}
      useSystemDarkMode
    >
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>
);
