<h1>1. Instalar Ionic CLI</h1>

`npm install -g @ionic/cli`

Comprobación:

`ionic --version`

<h1>2. Crear un proyecto nuevo Ionic + React + Vite</h1>

Creo el proyecto llamado frontend:

`ionic start frontend tabs --type=react --template blank --no-integrations`

O más simple:

`ionic start frontend blank --type=react`

Esto genera React, Ionic, Vite, y la estructura base (las nuevas versiones de Ionic ya usan Vite por defecto).

Me han salido vulnerabilidades que se arreglaban con un force (aprece en la terminal el código exacto). Dado que es un proyecto desde inicio, he aceptado arreglar las vulnerabilidades.

<h1>3. Entrar al proyecto e instalar dependencias</h1>

`cd frontend`

`npm install`

<h1>4. Añadir Capacitor (para Android/iOS)</h1>

`ionic cap add android`

`ionic cap add ios` (opcional)

Luego sincronizar:

`ionic cap sync`

<h1>5. Ejecutar el proyecto web</h1>

`npm run dev`

<h1>6. Abrir Android Studio (para compilar APK)</h1>

`ionic cap open android`

<h1>7. Crear los Providers (contexts)</h1>

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

<h1>8. Rutas como en tu App.tsx</h1>

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

<h1>9. Crear el backend desde cero (Express)</h1>

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

<h1>10. Creacion backend</h1

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