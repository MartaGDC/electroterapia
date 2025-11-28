import React from 'react'; // Necesario para usar JSX (<Component/>)
import { createRoot } from 'react-dom/client'; // para montar la aplicacion
import App from './App'; //Importa el componente principal de la aplicacion (App.tsx)

//Importacion de fuentes
import '@fontsource-variable/inter';
import '@fontsource/kaushan-script';
import '@fontsource-variable/nunito';
import '@fontsource-variable/noto-sans';

import './i18n'; //el archivo src/i18n.ts

//Importacion de contextos que envuelven el estado global (usuario, listas,...). Los genero como archivos vacíos que trabajaré al finalizar este.
//import { UserProvider } from './context/userContext';
//import { LogProvider } from './context/logContext';
import { AplicadorProvider } from './context/aplicadorContext';
import { UserListProvider } from './context/userListContext';



//Renderizado:
const container = document.getElementById('root'); //Busca en index.html el div root
const root = createRoot(container!); //Para poder crear el renderer del root
                                     //container! es non-null assertion. Sé que no es null, así que no hace falta comprobarlo
root.render(
  <React.StrictMode>
    <AplicadorProvider>
        <UserListProvider>
          <App />
        </UserListProvider>
    </AplicadorProvider>
  </React.StrictMode>
);

/* 
<React.StrictMode> Modo de desarrollo que avisa de errores potenciales (no afecta a producción).
  <Provider> La app se renderiza envuelta por providers. La app podrá acceder a lo que proporcionan estos
    <otro provider>
      <App /> 
    
*/