<h1>Preparación</h1>

<h2>1. Instalar Ionic CLI</h2>

`npm install -g @ionic/cli`

Comprobación:

`ionic --version`

<h2>2. Crear un proyecto nuevo Ionic + React + Vite</h2>

Creo el proyecto llamado frontend:

`ionic start frontend tabs --type=react --template blank --no-integrations`

O más simple:

`ionic start frontend blank --type=react`

Esto genera React, Ionic, Vite, y la estructura base (las nuevas versiones de Ionic ya usan Vite por defecto).

Me han salido vulnerabilidades que se arreglaban con un force (aprece en la terminal el código exacto). Dado que es un proyecto desde inicio, he aceptado arreglar las vulnerabilidades.

<h2>3. Entrar al proyecto e instalar dependencias</h2>

`cd frontend`

`npm install`

<h2>4. Añadir Capacitor (para Android/iOS)</h2>

`ionic cap add android`

`ionic cap add ios` (opcional)

Luego sincronizar:

`ionic cap sync`

<h2>5. Ejecutar el proyecto web</h2>

`npm run dev`

<h2>6. Abrir Android Studio (para compilar APK)</h2>

`ionic cap open android`

<h2>7. Crear los Providers (contexts)</h2>

Este proyecto tendrá:

    context/userContext.tsx
    context/logContext.tsx

Estos no se generan automáticamente, pero también se pueden crear. Ejemplo básico:

    import { createContext, useState } from "react";

    export const UserContext = createContext(null);

    export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
        {children}
        </UserContext.Provider>
    );
    }

Lo mismo para logs.

<h2>8. Rutas como en tu App.tsx</h2>

Un App.tsx típico con Ionic + React Router + Providers:

    <IonApp>
    <IonReactRouter>
        <UserProvider>
        <LogProvider>
            <IonRouterOutlet>
            <Route exact path="/">
                <Login />
            </Route>
            <Route path="/app">
                <Menu />
            </Route>
            </IonRouterOutlet>
        </LogProvider>
        </UserProvider>
    </IonReactRouter>
    </IonApp>

El proyecto es la plantilla estándar con modificaciones.

<h2>9. Crear el backend desde cero (Express)</h2>

Backend típico Express modular. Para crearlo:

`npm init -y`

`npm install express cors cookie-parser`

Luego crear app.js:

    import express from "express";
    import cors from "cors";
    import cookieParser from "cookie-parser";

    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
    origin: "http://localhost:8100",
    credentials: true
    }));

    app.listen(3000, () => console.log("Servidor arrancado en puerto 3000"));


Y una estructura como la inicial creada por el compañero:

    backend/
    routes/
    controllers/
    models/

<h2>10. Creacion backend</h2

La parte de backend se hace en otra carpeta, con Node + Express:

`npm init -y` → crea package.json del backend

`npm install express cors cookie-parser` → dependencias del servidor

`app.js` o `index.js` → archivo principal de backend

`routes/`, `controllers/`, `models/` → estructura del backend

    Frontend: (Ionic + React + Vite + Capacitor)
    └─ npm run dev / ionic cap sync / android build
    └─ Llama al backend via fetch/axios
    
    Backend (Node + Express)
    └─ npm start
    └─ Escucha rutas API /api/...

<h1>Configuración frontend</h1>

    android/
Generado por Capacitor. Aquí está el proyecto Android nativo (Java/Kotlin) que se abre con Android Studio.

    cypress/
Contiene tests automáticos end-to-end usando Cypress (pruebas de login, navegación, UI...). Útil para hacer testeos.

    dist/
Directorio generado por Vite. Es la versión compilada y optimizada de la app lista para producción. Lo usa Capacitator cuando se usa el comando `ionic cap sync`, ya que copiará este directorio dentro de Android o iOS. Es como el directorio build/ de otros proyectos (no tocar).

    ios/
Igual que android/, pero para iOS, generado por Capacitor. Se abre con Xcode.

    node_modules/
Se crea al hacer `npm install` (como en Vue). Se puede borrar y volver a crear, volviendo a hacer `npm install`.

    public/
Para archivos estáticos (favicon, manifest.json...). El index.html puede ir aquí o en raíz (en este caso esta en raíz). En el manifest.json se definen metadatos de la app que el navegador y los dispositivos usan para instalarla o mostrarla como app web (nombre, descripcion, display, colores, iconos...).

    src/
Donde se encontrarán las páginas, los componentes, estilos, servicios... y App.tsx y main.tsx. Elimino algunos archivos creados por defecto (src/components/ExploreContainer.css y src/components/ExploreContainer.tsx, src/pages/Home.css y src/pages/Home.tsx). Será necesario crear i18.ts para lo que será necesario instalar varios módulos (simialr a lo que se hizo para Vue):

`npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend`
- i18next: motor principal de internacionalización
- react-i18next: integración de i18next con React
- i18next-browser-languagedetector: detecta el idioma del navegador automáticamente.
- i18next-http-backend: para cargar traducciones desde archivos `/locales/*.json`.

Antes de ponerme con el código, cambio y dejo muy básica la estructura base de App.tsx (necesitará de componentes aun no creados y de logins). Se queda de esta manera:

    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
<br></br>

    .browserslistrc
Indica para qué navegadores debe compilar el código. Tal y como está incialmente, estña bien.

    .gitignore
Tal y como se inicia está bien, pero he añadido al final android e ios.

    capacitator.config.ts
Es la configuración principal de Capacitator, y define el  nombre de la app (le pongo el correcto), el id del paquete (com.nbempresa.app), ruta del build (como se ha dicho es dist/) y pluggins nativos para móvil (aunque no aparecen ni en el inicial ni en el del compañero). Tal y como se crea está bien.

    cypress.config.ts
Como se ha dicho cypress es para testing. Este archivo contiene la configuración de este framework (rutas de tests, baseURL, timeouts, plugins). Tal y como se crea está bien.

    eslint.config.js
O `.eslintrc.js` que es como aparece en el proyecto del compañero. Ayuda a matener el código limpio. Parece que ambos cumplen el mismo proposito pero el del compañero es una version más antigua (e incompatible con el mío) y más sencilla. También parece que en ambos casos es un archivo creado automáticamente y no modificado.

    index.html
HTML principal de carga. Vite lo usa como punto de entrada, y es donde se inyecta React (`<div id="root"></div>`)

    ionic.config.json
Configuración del CLI de Ionic. Incluye el nombre del proyecto, el puerto dev, la configuración del servidor y la integración con Capacitor. No afecta el código, solo el entorno de Ionic. Me aseguro de que el nombre de la app es el correcto. Pero con eso ya está.

    package-lock.json
Archivo automático generado por npm. En mi archivo inicial faltan muchas dependencias con respecto al trabajo del compañero. Esto se solucionará automáticamente conforme vaya instalando dependencias o módulos.

    package.json
Contiene dependencias, scripts (npm run dev, build, preview), el nombre del proyecto, las versiones de React, Ionic, Vite, Capacitor y más configuraciones. Se irá actualizando conforme vaya instalando dependencias o modulos.

    tsconfig.json
Configuración del compilador TypeScript. Define el nivel de comprobación, target ES6/ESNext, paths, tipado estricto, includes/excludes. Está bien tal y como se crea.

    tsconfig.node.json
Config necesaria para que Vite y Node entiendan TypeScript. No se toca, está bien como se crea.

    vite.config.ts
Configuración del bundler Vite. Controla plugins (como React, legacy), puerto del servidor, rutas de alias (@/components) configuraciones de producción, optimizaciones, base URL. Es crítico y está bien tal y como se crea.

En cuanto a los directorios y archivos que el compañero tiene el frontend y yo no:
-  assets/: lo añadiré conforme sea necesario
- Dockerfile: archivo de instrucciones oara crear una imagen Docker del proyecto.
- .dockerignore: archivos que Docker debe ignorar al crear la imagen (fundamentalmente node_modules/, el directorio creado al hacer `npm install`).
- android.sh: para compilar la app móvil. En principio no es necesaria, pero permitiría crear el directorio android/ y ejecutar comandos de forma automática si estos no están en el docker.

Por ahora no uso Docker (por falta de experiencia). Valolaré más adelante si lo hago.


<h1>Desarrollo frontend</h1>

1. **i18n**

    Instalo i18n como se ha explicado previamente, y creo el archivo src/i18n.ts y los archivos public/assets/locales para castellano (es) e inglés (en).

2. **Iconos**

    Paso todos los iconos a las carpetas correpondoentes.

3. **Manifest**

    Copio el public/manifest.josn que básicamente contiene nombre, descripción e iconos.

4. **main.tsx**

    src/main.tsx: Punto de entrada de la app. Su estructura contiene dentro a App. Main es lo global

5. **App.tsx**

    Es lo local, lo que cada usuario ve y con lo que trabaja, puede ser diferente segun uduarios. En este caso tiene contextos particulares dependientes del usuario, además de establecer rutas de login y menu (componentes a nivel App, no a nivel main)

5. **Constantes**

    Directorio src/constants, que contiene constants, interfaces y simuladores.

    - constants.tsx: permite acceder desde otros componentes a iconos, colores, paths, número de columnas y url backend. EL objeto constants contiene pares de claves valor.

    - interfaces.tsx: En este elemento se declaran diferentes objetos:
        - Time: clase que probablemente se usará uso para temporizadores, cronómetros, sesiones de tratamiento.

        - Tramo: interfaz compuesta por valor maximo, color y mensaje a mostrar (number, string y string)
        
        - Simuladores: enum que enumera los tipos de simuladores y tratamientos. Sirve para acceder a strings.
        
        - PositionsTDCS: enum que enumera posiciones de electrodos. También sirve para acceder a strings.
        
        - stringToPositionTDCS: map que convierte un string recibido en un valor de PositionsTDCS (si se recibe por ejemplo del backend poderlo asociar al string de PositionsTDCS)
        
        - Roles: Enumeracion de alumno y profesor, de nuevo para acceder a Strings sin escribirlos. Evita errores tipográficos al comprobar permisos.
        
        - Room: es un type que define la estructura de una sala (room). Contiene identificador, nombre, descripción, contraseña, estado (abierto/cerrado), fecha y un array de logs (con datos procedentes del tupo Log).
        
        - RoomStudent: es un type similar a Room, pero solo con información relevante para un estudiante.
        
        - Log: Representa un registro de actividad/evaluación de un estudiante en un simulador. Contiene ID, usuario, sesión, parámetros (fijos y variables), tipo de simulador (según el enum del mismo archivo Simuladores), identificador de sala y estado finalizado (finished).

    - simuladores.tsx: Contiene un array con todos los temas de estudio y sus paths de aprendizaje, simulación y evaluación. **Me quiero asegurar** de que el apartado de modes de constants.tsx no tiene utilidad una vez creado este archivo simuladores.tsx.


6. **Clases customizadas**

    Directorio src/clases que contiene Aplicadores, Electrodos, Materiales y TiposAplicadores

    - Tipos de Aplicadores: Cnsiderando todos los strings del enum Simuladores en interfaces.tsx, define para cada clase aplicador su nombre (procedene de ese enum), y las propiedades con sus posibles valores, diferentes para cada aplicador. Además cada una de las clases contiene un metodo toString para mostrar los valores seleccionados dentro de sus caracteristicas.

    - Aplicadores: importa los tipos de aplicadores y los iconos de constants.tsx. Define la clase Aplicador, a la que le da unas coordenadas xy, un tipo de aplicador y un color. Contiene dos funciones, una para generar un nuevo aplicador del mismo tipo pero con nuevas coordenadas (add()), y otra para devolver el icono correspondiente como elemento html (icono()). Tambien define un enum de Aplicadores donde asocia cada tipo de Aplicadores (no están todos los definidos en el enum Simuladores de interfaces.tsx, pero sí todos los definidos en TiposAplicadores.tsx) a un número.
    
    - Materiales: Define las clase de MaterialAguja, MaterialCaucho, MaterialAdhesivo que contienen su tamaño (para lo que se crean clases enum intermedias) el tipo de material y una funcion para devolver el tamaño y el area. Tambien se crean clases que contienen todos los tamaños del objeto de un tipo concreto. También tiene clases enum para Complemento,ProductoConduccion, ProductoProteccion y Farmacos, y clases que contienen a todos los tipos de enum de cada clase enum.
    
    - Electrodos: importa iconos y los materiles aguja, caucho y adhesivo de Materiales.tsx. Devuelve iconos según el tipo de electrodo (definido como enum, pero siendo finalmente una propiedad del objeto electrodo) y define el objeto Electrodo con coordenadas, tipo, color, nombre, material y canal, estableciendo en el constructor los valores default. Contiene funciones para crear un electrodo igual pero en otra localizacion, para devolver el icono, para devolver tipo y canal como string, para elegir el material (set), para quitarlo, para cambiar el material (devuelve el objeto), pare devolver el area, y devolver true si existe (tiene material y tamaño).


7. **Contextos**

    Directorio src/context para los archivos que proporcionarán los providers que envolverán la app (lista de alumnos, detalles de usuario...).

    Los contextos en typescript sirven para compartir datos entre muchos compoenentes sin tener que asignar proprs continuamente en cada componente. Los contextos rodean la aplicacion y cualquier componente lo puede leer o modificar sin usar prop.

    - aplicadorContext: requiere de la clase Aplicador definida en Aplicadores.tsx. Se crea un type, que contiene los estados modoAlpicador (el objeto aplicador elegido, o niguno), activo, pasivo, modoDiatermia, modoOndaCorta, tipoLaser, tipoagnetoterapia, tipoOndasChoque. Estos estados serán opciones que el usuario elegirá para finalmente crear el aplicador deseado. Se crea el contexto vacío usando este type creado. Se crea el provider, que es quien contiene y provee los valores del contexto, y adicionalmente tiene una funcion para resetear estos estados o valores del contexto. El provider hacer un return con todos los estados y sus valores.

    - userListContext: requiere de axios. Instalar con `npm install axios`. Axios sirve para contectar un backend Express con el forntend React/Ionic. Se crea una carpeta api/ para hacer esta conexion con el backend. Requiere clases para el manejo de usuarios creadas en api/user.tsx y de los Roles definidos en interfaces.tsx.


    - userContext:

    - logContext:


8. **api**


9. **Components**


10. **Pages**


11. **Themes**