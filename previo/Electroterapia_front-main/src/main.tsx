import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource-variable/inter';
import '@fontsource/kaushan-script';
import '@fontsource-variable/nunito';
import '@fontsource-variable/noto-sans';
import './i18n';
import { UserProvider } from './context/userContext';
import { LogProvider } from './context/logContext';
import { AplicadorProvider } from './context/aplicadorContext';
import { UserListProvider } from './context/userListContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AplicadorProvider>
        <UserListProvider>
          <App />
        </UserListProvider>
    </AplicadorProvider>
  </React.StrictMode>
);