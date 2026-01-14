import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */

// import '@ionic/react/css/palettes/dark.system.css';
import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import Menu from './components/Menu';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { LogProvider } from './context/logContext';
import { UserProvider } from './context/userContext';
import { App as CapacitorApp} from '@capacitor/app';
import { useIonRouter } from '@ionic/react';
import AlumnoRegistro from './pages/Continua/AlmunoRegistro';

setupIonicReact();

const DeepLinkHandler: React.FC = () => {
  const router = useIonRouter();
  const [pendingDeepLink, setPendingDeepLink] = useState<string | null>(null);

  useEffect(() => {
    CapacitorApp.addListener('appUrlOpen', (data: any) => {
      console.log('==== Deep Link Opened ====');
      console.log('URL completa:', data.url);

      if (!data.url) return;

      const path = data.url.split('://')[1]; // "app/alumnoRegistro/XXX"
      console.log('Ruta parseada:', path);

      const codeQR = path.startsWith('app/alumnoRegistro') ? path.split('/')[2] : null;
      if (codeQR) console.log('Código QR detectado:', codeQR);

      // Guardar ruta pendiente y hacer push cuando router esté listo
      setPendingDeepLink(`/${path}`);
    });
  }, []);

  useEffect(() => {
    if (pendingDeepLink && router) {
      console.log('Redirigiendo deep link a:', pendingDeepLink);
      router.push(pendingDeepLink);
      setPendingDeepLink(null);
    }
  }, [pendingDeepLink, router]);

  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    const lockOrientation = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        try {
          await ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
        } catch (error) {
          console.error("No se pudo bloquear la orientación:", error);
        }
      } else {
        console.log("Orientación no bloqueada: ejecutando en web");
      }
    };

    lockOrientation();
    StatusBar.hide();

    return () => {
      if (Capacitor.getPlatform() !== 'web') {
        ScreenOrientation.unlock();
      }
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <DeepLinkHandler />
        <UserProvider>
          <LogProvider>
            <IonRouterOutlet>
              <Route path="/app/alumnoRegistro/:codeQR" component={AlumnoRegistro} />
              <Route exact path="/" component={Login} />
              <Route path="/app" component={Menu} />
            </IonRouterOutlet>
          </LogProvider>
        </UserProvider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;