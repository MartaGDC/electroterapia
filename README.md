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

<h2>9. Crear el backend desde cero (Node con Express)</h2>

    cd backend
    npm init -y
    npm install express cors dotenv mongoose bcryptjs jsonwebtoken cookie-parser
    npm install -D nodemon standard

En package.json se añade al inicio `"type": "module"` (Node usará ES Modules (import/export) en vez de de CommonJS (require)), y se agrega en "scripts" `"dev": "nodemon index.js"` (para poder arrancar el backend con nodemon).

Las instalaciones de despendencias sirven para:

    - express: framework de servidor Node
    - cors: habilitar CORS (acceso desde frontend)
    - dotenv: variables de entorno
    - mongoose: conexión con MongoDB
    - bcryptjs: cifrado de contraseñas
    - jsonwebtoken: tokens JWT (permiten guardar usuarios sin guardar sension en el servidor). Usado en lib/jwt.js
    - cookie-parser: leer cookies en Express
    - nodemon (dev): reinicio automático en desarrollo
    - standard (dev): estilo de código

Los documentos se explicarán en el apartado de backend.


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

    src/main.tsx: Punto de entrada de la app, requiere instalar las fontsource (`npm install @fontsource...`). Su estructura contiene dentro a App. Main es lo global

5. **App.tsx**

    Es lo local, lo que cada usuario ve y con lo que trabaja, puede ser diferente segun uduarios. En este caso tiene contextos particulares dependientes del usuario, además de establecer rutas de login y menu (componentes a nivel App, no a nivel main). Hay que instalar @capacitor/status-bar (`npm intal @capacitor/status-bar`).

6. **Constantes**

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


7. **Clases customizadas**

    Directorio src/clases que contiene Aplicadores, Electrodos, Materiales y TiposAplicadores

    - Tipos de Aplicadores: Cnsiderando todos los strings del enum Simuladores en interfaces.tsx, define para cada clase aplicador su nombre (procedene de ese enum), y las propiedades con sus posibles valores, diferentes para cada aplicador. Además cada una de las clases contiene un metodo toString para mostrar los valores seleccionados dentro de sus caracteristicas.

    - Aplicadores: importa los tipos de aplicadores y los iconos de constants.tsx. Define la clase Aplicador, a la que le da unas coordenadas xy, un tipo de aplicador y un color. Contiene dos funciones, una para generar un nuevo aplicador del mismo tipo pero con nuevas coordenadas (add()), y otra para devolver el icono correspondiente como elemento html (icono()). Tambien define un enum de Aplicadores donde asocia cada tipo de Aplicadores (no están todos los definidos en el enum Simuladores de interfaces.tsx, pero sí todos los definidos en TiposAplicadores.tsx) a un número.
    
    - Materiales: Define las clase de MaterialAguja, MaterialCaucho, MaterialAdhesivo que contienen su tamaño (para lo que se crean clases enum intermedias) el tipo de material y una funcion para devolver el tamaño y el area. Tambien se crean clases que contienen todos los tamaños del objeto de un tipo concreto. También tiene clases enum para Complemento,ProductoConduccion, ProductoProteccion y Farmacos, y clases que contienen a todos los tipos de enum de cada clase enum.
    
    - Electrodos: importa iconos y los materiles aguja, caucho y adhesivo de Materiales.tsx. Devuelve iconos según el tipo de electrodo (definido como enum, pero siendo finalmente una propiedad del objeto electrodo) y define el objeto Electrodo con coordenadas, tipo, color, nombre, material y canal, estableciendo en el constructor los valores default. Contiene funciones para crear un electrodo igual pero en otra localizacion, para devolver el icono, para devolver tipo y canal como string, para elegir el material (set), para quitarlo, para cambiar el material (devuelve el objeto), pare devolver el area, y devolver true si existe (tiene material y tamaño).


8. **Contextos**

    Directorio src/context para los archivos que proporcionarán los providers que envolverán la app (lista de alumnos, detalles de usuario...).

    Los contextos en typescript sirven para compartir datos entre muchos compoenentes sin tener que asignar proprs continuamente en cada componente. Los contextos rodean la aplicacion y cualquier componente lo puede leer o modificar sin usar prop.

    useRef es un contenedor para un valor persistente durante la vida de un componeente, mientras que useState causa que el componenete se re-renderice cuando cambia el valor.

    - aplicadorContext: requiere de la clase Aplicador definida en Aplicadores.tsx. Se crea un type, que contiene los estados modoAlpicador (el objeto aplicador elegido, o niguno), activo, pasivo, modoDiatermia, modoOndaCorta, tipoLaser, tipoagnetoterapia, tipoOndasChoque. Estos estados serán opciones que el usuario elegirá para finalmente crear el aplicador deseado. Se crea el contexto vacío usando este type creado. Se crea el provider, que es quien contiene y provee los valores del contexto, y adicionalmente tiene una funcion para resetear estos estados o valores del contexto. El provider hacer un return con todos los estados y sus valores.

    - userListContext: requiere de axios. Instalar con `npm install axios`. Axios sirve para contectar un backend Express con el forntend React/Ionic. Se crea una carpeta api/ para hacer esta conexion con el backend. userListContext requiere clases para el manejo de usuarios creadas en api/user.tsx y de los Roles definidos en interfaces.tsx.
        Define el type User con id, name y role definido por el enum de Roles de interfaces.tsx, el type SelectedUserMap donde el id del user tiene asignado un boolean, el type UserListContextType que usará el provider, formado por un array de objetos User, por el objeto SelectedUserMap, el numero de profesores y por funciones que se definen más adelante en el código dentro del provider:
        - addUsers: introduciendo como parámetro una array de objetos conformados por pares-valor de nombre, contraseña y rol, devuelve un array de todos los usuarios con promise porque lo hará preguntando al servidor. A efectos rácticos, hace la peticion al servidor definida en createUsers de api/user y la añade al listado de usuarios total, ordena esta lista para presentar primero los profesores y despues los estudiantes. Realiza el conteo de número de profesores por si tuviera que atualziarse. Actualiza en el provider el listado y el listado visible para la búsqueda (aunque parezcan lo mismo parecen elementos diferentes necesarios en el contexto). Tras añadir usuario se establecen todos los type SelectedUserMap de cada usuario de la lista como falso, los dará como deseleccionados en el contexto.
        - eliminateUsers: introduciendo un array de id, se eliminarán de la lista. A efectos rácticos, hace la peticion al servidor definida en deleteUsers de api/user, y en caso de que el rol del usuario sea profesor, actualiza el número de proferores. Actualiza la lista de usuarios y la lista de búsqueda de usuarios.
        - getUsers: A efectos rácticos, hace la peticion al servidor definida en getAllUsers de api/user, realiza el conteo de profesores, actualiza la lista de usuarios y la lista de búsqueda de usuarios y se establecen todos los type SelectedUserMap de cada usuario de la lista como falso, los dará como deseleccionados en el contexto.
        - selectUser: actualiza el estado de SelectedUserMap en el provider (`const [selected, setSelected] = useState<SelectedUsersMap>({})`) para el id de un usuario con el boleano elegido.
        - selectAllUsers: selecciona todos los alumnos, actualizando el estado de SelectedUserMap en el provider.
        - deleteSelectedUsers: hace los mismo que eliminateUser pero haciendo un filtrado previo del listado de usuarios por aquellos que estan seleccionados.
        - search: filtra el listado de usuarios con lo introducido en el query de elemento HTML para el nombre de los usuarios. Si el indide de coincidencia es mayor a -1 (se encuentra coincidencia en algun punto del string) se actualiza el listado visible para búsqueda.

    - userContext: usado por app no por main. userContext requiere clases para el logeo de usuarios creadas en api/user.tsx y de una clase de ionic/react llamada useIonRouter que sirve para la navegación de manera más majica que usando useNavigate. El type del contexto que usará el provider está formado por user (cualquier valor), token (cualquier valor), loading (boolean, true por defecto dentro del provider hasta que se haya hecho register, login o logout), y funciones que se definirán en el provider:
        - register: llama a la función registerUser de api/user que requiere un name, un password y el role de estudiante. Establece el user del provider y del localStorage según el valor user de la respuesta del servidor, y el token del provider y del localStorage según el valor token de la respuesta del servidor. Establece el loading como false
        - login: llama a la función loginUser de api/user que requiere un nip y un password. Establece el user del provider y del localStorage según el valor user de la respuesta del servidor, y el token del provider y del localStorage según el valor token de la respuesta del servidor. Establece el loading como false.
        - logout: llama a la función logoutUser de api/user. Elimina el user y el token del localStorage. Establece el loading como false.

        Adicionalmente, el provider ejecuta una función de react, no accesible desede el contexto, llamada useEffect, que sirve para ejecutar código después de que el componente se haya montado (finaliza con []), y que en este caso comprueba los valores de user y token guardados en localStorage a través de llamadas a api/user con sus funciones verifyTokenUser, y lleva a app/home usando useIonRouter.

    - logContext: usado por app no por main. Requiere clases del log procedentes de api/log, de constants/interfaces.tsx, classes/Electrodos.tsx, classes/Materiales.tsx, components/Logs/Logs.tsx, classes/Aplicadores.tsx, y el contexto aplicadorContext.tsx. Primero crea tres clases enum y type para utilizar como propiedades en el context y provider: enum Estado (detenido, simulando o pausado), type LogState (popiedad estado como Estado, simulating como boolean y puased como boolean), y type LogAction (con los posibles valores iniciar, pausar, reanudar y finalizar), además tambien está definida posteriomente una const llamada reducer que usará el provider a través de una función propia de React llamada useReducer, que devuelve un LogState determinado según el LogAction introducido (en caso de que no sea ninguno de los 4 LogAction posibles), o el LogState inicial. useReducer es similar a useState pero para lógicas más complejas y se ejecuta cuando el componente se monta o cuando se mandan dispatch.

        El contexto esta formado por boolean simulating, boolean paused, number tiempoRestante, number width, number heigth, Electrodo anodoCanal1, Electrodo catodoCanal1, Electrodo anodoCanal2, Electrodo catodoCanal2, boolean complemento, PositionsTDCS nodoTDCS, PositionsTDCS catodoTDCS, Aplicador aplicador1 Aplicador aplicador2, array de boolean conduccion, array de boolean   proteccion, boolean farmaco y RoomStudent room, y funciones set (`React.Dispatch<React.SetStateAction<>>`) y funciones que se definirán en el provider:
        - iniciar: establece el estado de la variable tipo definido en el provider que tiene un valor entre aprendizaje, simulación o evaluación. Si no es aprendizaje, establece que lastSavedParams (definido en provider con referencia a time y params) tiene los valores introducidos en la función como parámetros, llama a la funcion initLog de api/log.tsx con los paramtros variables y fijos (funciones explicadas posteriormente) y devuelve sessionId y ejecuta la funcion iniciarGuardado (comienza un setInterval que intenta guardar params con la funcion de api/log.tsx saveParamso backend via saveParams (sessionId, paramsRef.current)). Envía al reducer como dispatch "INICIAR" e inicia una cuenta atras.
        - pausar: llama a detenerGuardado (cancela el intervalo de guardado periodico y hace nulo intervalIdRef), envía al reducer el dispacth "PAUSAR", frena la cuenta atrás, y muestra tiempoRestanteRef con el estado (useState) de tiempoRestante.
        - reanudar: si queda tiempo y el tipo no es aprendizaje, ejecuta iniciarGuardado(). Si queda tiempo envía al reducer el dispatch "REANUDAR", actualiza ultimaReanudacionRef, y ejecuta cuentaAtras.
        - finalizar: si el tipo no es aprendizaje, ejecuta detenerGuardado. Si existe timeoutRef, ejecuta clearInterval del mismo y lo pasa a null. Si existe sessionIdRef y el tipo no es aprendizaje ejecuta de api/log.tsx la función endLog para la sessionIdRef y con los paramsRef, y depués pasa éstos a nulo. Envía al reducer como dispatch FINALIZAR. Si el tipo es evaluación pasa el room a nulo y envía a app/evaluacion.
        - eliminar: similar a finalizar pero llama a la función deleteLog de api/log.tsx.
        - agregarParams: Si el estado es SIMULANDO, mete los constructVariableParams de los parametros introducidos en la función a paramsRef y actualiza lastSavedParams. Si el estado es PAUSADO: vacía paramsRef and mete en paramsRef los ultimos guardados (lastSavedParams).
        - reset: elimina todos los sets realizados con useState para todas las propiedadesd el contexto, le da el valor finalizar (de LogAction) al dispatch definidio en el useReducer y ejecuta la funcion resetAplicadorContext de aplicadorContext.tsx.
        - establecerActividad: para establecer el setRoom con un objeto RoomStudent.

        Adicionalmente, hay funciones "helper" para los materiales:
        - materialVariableParams: devuelve la parte variable en el log: width, height, anodoCanal1, catodoCanal1, anodoCanal2, catodoCanal2, aplicador1 y aplicador2.
        - materialFixedParams: devuelve la parte fija en el log: complemento, anodoTDCS, catodoTDCS, conduccion, proteccion, farmaco.
        - constructVariableParams: une un objeto que contienen paramentros con los valores de electrodos (anodo y catodo, 1 y 2) y de los aplciadores **¿?** para crear los parametros que se deberán guardar.
        - constructFixedParams: une parametros fijos pasados con los que devuelve materialFixedParams.
        
        Y varios useEffectque se ejecutan en diferentes momentos de actualización de los electrodos y de los aplicadores. Estos useEffect llaman a otras funciones:
        - agregarElecs: Actualiza los parámetros que se almacenarán en el log. Introduce en paramsRef el resultado de la funcion constructVariableParams con los parámetros introducidos. Si el estado es simulando se añaden, si el estado es pausado, se eliminan y entonces se añaden.
        - averageElec y averageApl procedentes de components/Logs/Logs.tsx


9. **api**

- users: sirve para exportar funciones (register, login, logout, verify token, fetch/create/delete users). Las funciones utiliza axiosConfig.tsx y utiliza la contante apiURL de constants/constants.tsc para la url base.
- axiosConfig: crea y exporta una instancia preconfigurada de Axios para todas las llamadas http. withCredentials: true significa que Axios enviará cookies y otras credenciales. Axios simplifica la escritura de peticiones, en las que hace de forma automatica fetch cuyo body será el parámetro introducido en la función que se usará en frontend.
- log: sirve para exportar funciones para interactuar con el backend acerca de los logs (init, save parameters, end, delete, get by id). Usa axiosConfig y constants.apiURL para los requests.
- room:  sirve para conectar backend relacioando con las variables de room (creating/updating/deleting, fetching lists y logs, y entrar en rooms). Usa axiosConfig y constants.apiURL.


10. **Pages**

    De acuerdo a App.tsx se comienza en Login y Menu. El Login está definido enpages/login.tsx, que tiene una parte izquierda con el logo y en la parte derecha el usuario, contraseña y submit. Si los datos son correctos, lleva a Home.

    Para ir a Home, la direccion incluye app/, que tal y como está definido en App.tsx, debe renderizar el componenete Menú. Para que pueda ir a Home, es necesario que la app sepa donde se encuentra home. Por este motivo es necesario tener la importacion de Home en Menu especificando su direccion y archivo.
    - Botón Aprendizaje: como empieza por app, aparece el menu (por lo que esta pagina debe estar correctamente definida en menu) y muchos botones para cada tema. Para poder generar los titulos de bloque hace un bucle usando constants/simuladores.tsx, y subbucles para los botones de cada tema con el indice aprendizaje.
        - Corriente galvánica: requiere componentes de grfica, de picker, logica y de tDCS. Explicacion:

            Permite elegir técnica, ajustar intensidad y tiempos, seleccionar electrodos, mostrar una gráfica, leer información teórica e iniciar un tratamiento simulado.

                const { t } = useTranslation();
                const [present] = useIonToast();
                const { simulating, tiempoRestante, iniciar } = useLog();
            useTranslation() → para textos traducidos.
            
            useIonToast() → para mostrar mensajes en pantalla.
            
            useLog() → contexto que controla la simulación (tiempos, estado, logs…).

            El componente guarda muchos estados (tiempos, intensidad, y electrodos (clase con color, tamaño, tipo...), serie para gráficos, técnica seleccionada).
            
            Al entrar en la página se ejecuta `useIonViewWillEnter` que realiza unr eset automático de los estados.

            Recupera grupo de indicaciones y grupo de contrindicaciones desde el archivo de traducciones.

            Construye las opciones del selector de tecnica (objeto ListPicker) procedentes del archivo de traducciones y gracias a Logica/General.tsx donde permite hacer un mapeo y devolver los valores.

            Posteriormente se realiza la lógica del cambio de la técnica donde se establecen valores de electrodos,intensidad, tiempos y tratamientos según la técnica seleccionada.

            Usa useEffects para modificar automáticamente la gráfica si cambia tratamiento, rampa, intensidad, catodo o anodo, y para calcular la dosis máxima si cambia catodo o anodo.
            
            Despues esta la función para iniciar la simulacion, que comprueba si se puede iniciar, y si puede llama a la funcion de Galvanica.tsx exhaustiveSerie() y a la función iniciar de useLog de LogContext.tsx. Esta función se ejecuta al clicar un LogButton con esta función como prop inciar.
            
            La interfaz se divide en dos columnas, la izquierda con selector de técnica, intensidad, tiempo, botones, selector de materiales, y la derecha gráfico y texto explicativo con `<Trans />` para HTML traducido.

            - Selector de técnica: Componente creado en ListPicker.tsx que requiere variable, onChange, label, placeholder, valueOptions, y dos parámetros opcionales disabled e insideInput.
            
                - variable: es la variable tecnica que se define con useState a [tecnica, setTecnica] a través de la const tecnicas creadas en Galvanica.tsx (es una variabl de pares valor, con un nombre que identifica la tecnica y un valor asociado de 0 a 3).

                - onChange: ejecutará la función cambiarTecnica que establecía valores según la tecnica.

                - label: accede al archivo de traducciones.

                - placeholder: accede al archivo de traducciones.

                - valueOptions: son tecOptions creadas por una función que (también) se llama valueOptions generada en Logica/General.tsx que require un string, el useTranslator, un array y una función con valor boolean (que terminará qué está deshabilitado), y devuelve pares-valor con las claves name, value y disabled. En el caso de tecOptions los parámetros introducidos son el string GALVANICA.TECNICAS.OPCIONES, que se buscará en el archivo de traducciones para obtener los valores en name, el value será el índice de cada valor en el archivo de traduccion (que el autor ha hecho que coincida con tecnicas.values), y el valor disabled introducido en parámetro para todos los elementos del array que devuelve.

                - disabled: adquiere el valor de simulating que procede de useLog del contexto logContext (cuyo valor es definido por su reducer).

                - insideInput: por defecto falso, no se le da valor desde GalvanicaAprendizaje.tsx, pero esto solo afecta a su estilo.

                Este componente está fomado por IonItem>IonSelect>IonSelectOption. Es decir, un select con opciones, que al elegir una opcion ejecuta un onIonChange donde pasa a la función onChange recibida por parámetros el event.detail.value del cambio, y al pasar el ratón o clicar se aplia un tint negro (variables.css). Cada una de las opciones tiene una key, un valor y el estado disabled, y muestra un nombre, todo pasado por parámetros.

            - Seleccion de intensidad: Componente creado en RangeColorPicker.tsx que requiere de name, variable, setVariable, disabled, min, max, step, sections y dos parámetros opcionales unit e infoMsg.

                - name: accede al archivo de traducciones.

                - variable:es la variable intensidad que se define con useState a [intensidad, setIntensidad], que se establece inicialmente con valor 0 en useIonViewWillEnter, y se reestablece en cambiarTecnica.

                - setVariable: llama a setIntensidad definida con useState.

                - disabled: si la tecnica es diferente a tecnicas.NULL_TEC disabled es true.

                - min: es el valor minIntensidad procedente de Galvanica.tsx, que vale 0.0.

                - max: es el valor maxIntensidad procedente de Galvanica.tsx, que vale 50.0.

                - step: 0.1

                - sections: es un array con dos "diccionarios", uno para la maxima dosis y otro para la máxima intensidad. De esta manera se muestra un mensaje y con un color. El estado incial dentro de RangeColorPicker es el primer diccionario, y se va actualizando al modificar el valor del parámetro variable  o del tramo/seccion (? esto cambia?).

                - unit: mA.

                - infoMsg: vacío para GalvanicaAprendizaje.

                Este componente está fomado por:
                
                    IonItem>
                        IonLabel>
                            IonIcon
                            IonPopover
                            input
                            IonRange
                Es decir, un elemento con un label, y debajo un icono de información y un popover de información si hay infoMsg (no es el caso). Después muestra un input numérico con los parametros introducidos para value, max, min y step, y cuando se cambia el input, se llama a setVariable del parámetro. El input estara disabled si asi se ha dicho por parámetro o si el min es igual al max. Después muestra las unidades. Debajo aparece un IonRange donde se pasan los parátro de manera similar al input, pero a través de un range.


        - BAJA FRECUENCIA...

        - MEDIA FRECUENCIA: Falta terminarlo.

        - ALTA FRECUENCIA: falta terminarlos.

        - FOTOTERAPIA: Infrarrojo falta terminar. Láser bastante bien. Ultravioletas bastante bien.

        - MAGNETOTERAPIA: falta terminar.

        - OTRAS TECNICAS: ultasonidos y ondas de choque bastante bien.

    - Botón simulación: 

    - Botón evaluación: necesita el folder de backend para fucionar, hace un get desde api/romm.tsx necesario. Hasta este momento la dependencia con api se había podido ignorar en la fase desarrollo (se falsea la verificación de usuraios), pero ahora obliga. Para ello, creamos al folder backend y para imitar el proyecto del compañero hacemos: 
        


11. **Components**
    1. **Logs**
    - Logs: sirve para reunir y suvizar los datos posicionales de electrodos y aplicadores. Además expone dos funciones: averageElec (se introducen como parametros electrodos (ref), número de electrodos (ref), callback (función que recibirá como argumento en los elementos que la usen el "avgElectrodo" y devolverá void) y un nuevo electrodo, y si el número es superior a 10 promedia la posicion y crea un electrodo con esta nueva posicion y el resto de datos del electrodo introducido como parámetro, sobre el que se podrán hacer diferentes funciones gracias al callback)  y averageApl (igual que la anterior pero para aplicadores).

    - LogButton.tsx (y css): requiere de la función useLog del contexto logContext.tsx que es la que crea el contexto.

    2. **Alumnos**
    - SubidaFichero.tsx y css:

    - AlumnosCrearModal.tsx y css:

    3. **Grafica**
    
        Requiere la instalación de apexcharts (`npm install apexcharts`)
    


12. **Themes**

    Contiene el archivo variables.css que es un archivo global de estilos al que acceder los componentes html. Además este archivo permite sobreescribir estilos de ionic para toda la aplicación.


<h1>Configuración backend</h1>

se ha desarrollado mediante Node.js con el framework de Express.js. Se ha optado por una arquitectura de tipo API RESTful, lo que permite una comunicacion estructurada, escalable y mantenible entre el cliente y el servidor. Se definen rutas que actúan como endpoints a los que se realizan las peticiones HTTP. Estos endpoints llaman a los controladores de la API, que son los responsables de la lógica.


Para aceder a las variables del entorno env, es necesario tener un archivo .env (en gitignore, por lo que desconozco el que usó el compañero), que defina el puerto, la direccion de mongodb y el token_secret.

    models/
Donde se define el contenido de la base de datos MongoDB.

    controllers/
Donde se definen las funciones a realzar sobre la base de datos.

    routes/
Donde se asocian las funciones con direcciones de la api a la que accederá el frontend.

    libs/
Contiene una clase donde se definen los simuladores que se usaran en otros archivos, y el archivo jwt.js (JSON Web Token) que sirve para autenticar usuarios, mantener la sesion y restringir rutas según roles.

    package.json
Se crea automáticamente con los comandos de creación. Una vez creado package.json éste hace referencia a index.js en scripts, que a su vez llama a app.js.

    package-lock.json
Creado automáticamente, no tocar.

    index.js
Importa la cont app del archivo app.js donde está la instancia del servidor Node Express, importa la función connnectDB del arhcivo db.js, e importa tambien variables locales de entorno a las que accede el archivo config.js que llama a .env.

    app.js
Llama a las ruta definidas en los documentos de /routes para las consultas API RESTful y las registra en el servidor. A través de cors, se habilitan las peticiones dessw frontend a express (localhost:5137 que es la direccion visible en frontend, y credentials true que permite el envío de cookies y otras credenciales).

    db.js
Define la función de conexión a la base de datos MongoDB. Esta función requiere de la dirección de conexión conMongoDb, que procederá de config.js y .env.

    config.js
Ejecuta la función config() de dotenv y establece valores para el puerto de escucha, la dirección de conexión de mongoDB y el token secreto de la simulación. Esto lo hace llamando alas variables guardads en .env si existen, y si no les da valorespor defecto.

    .env
No disponible, dado que es un documento sensible y no está en el proyecto de github. Se puede imaginar que aquí están las variables a las que llama config.js.
El puerto posiblemente sea 4000. La dirección a MongoDB hará referencia a una creada en MongoDB Atlas (en la nube, versión gratuita). El TOKEN será cualquiera que yo defina.

    .gitignore
Lo copio del compañero.


<h1>Desarrollo backend</h1>

1. **MongoDB Atlas**

    https://www.mongodb.com/cloud/atlas/register

    Me registro con mi cuenta de gmail. Establezco características básicas y plan gratuito. Se establece la **IP actual como aquella con conexión** incialmente a este cluster (el nombre del cluster es clusterElectroUZ). Creo al usuario con los datos que aparecerán en la url presente en .env, ademñas añado un nombre para la base de datos y parametros opcionales que hace más segura y resiliente la escritura sobre la base de datos (...mongodb.net/electroDB?retryWrites=true&w=majority&appName=ClusterElectroUZ).

    Paso a seleccion de método de conexión con Driver para conectar desde la propia aplicacion. En este caso es para Node.js. Recomiendan instalar en el folder del backend `npm install mongodb`, pero en mi código uso mongoose, que es lo que ya he instalado. Elimino en atlas, los datos de prueba que ha creado (1 base de datos con 6 colecciones). Cada model creado en el backend será una colección. 
    

2. **index.js, app.js, config.js**

    Explicados en el mismo archivo.

3. **.env**

    Con lo explicado se escribirá una vez cree la base en MongoDB Atlas.

4. **jwt.js**

    Usa la libreria jsonwebtoken, llama a las variables de entorno (config.js) y al modelo de usuario del mongoDB (user.model.js).

    Exporta las const createAccessToken, authRequired, authTeacherRequired, verifyToken, que según cuál se llamarán en el archivo de controller de usuario (user.controller.js), o se definirán rutas para verificación y para manejo de usuarios donde servirán como middleware antes de ejecutar las funciones de manejo definidas en controller del usuario, de la sala y de los logs.

    - createAccessToken: se usará en user.controller. Requiere de un payload (en este caso es simplemente un id), y devuelve una promesa (async) donde se firma el payload introducido con el token de .env, y expira en un día. Esto significa que el token contiene de manera codificada el id pasado como payload. **ESTO ES UN ERROR, DEBERÍA PASAR COMO PAYLOAD EL ID Y EL ROLE PARA PODER HACER AUTHTEACHERREQUIRED**.
    - authRequired: se usa como middleware para proteger rutas. Al ejecutar las funciones de los controller, primero se ejecuta el middleware según cómo estén definidos en los archivos de routes. Comprueba que req (petición del cliente) tiene una cookie llamada token (req.cookies.token) y verifica que sea igual que el token de .env. Si no lo es, manda como respuesta (res) error 400. Si la verificación es correcta pasa a req.userId el valor id codigficado en el token gracias a createAccessToken. Después de hacer esto ejecuta next() lo que permite continuar a la ruta siguiente tras finalizar el middleware.
    - authTeacherRequired: se usa como middleware para proteger rutas de manejo de usuarios, obtencion de log, y evaluacion y obtencion, creacion y eliminacion de room. Es similar al anterior pero verifica tambén el rol del token (NO SE HA GUARDADO EN EL CÓDIGO DEL COMPAÑERO).
    - verifyToken: se usa para crear una ruta cuyo middleware es authRequired. Es muy similar, pero en este caso verifyToken en vez de comprobar el token de cookies con el token de env, comprueba el token del body de la petición del cliente, es decir, un token que procede de otra estructura que no es ni cookie ni header, sino el body, que en nuestro código lo hace solo axios. En el api/user.tsx de frontend establece que el parametro introducido (body) es una prop. En userContext el provider hace esta comprobación introduciendo como prop el token guardado en localStorage.

5. **models**
    1. user.model.js: es un esquema de MongoDB con name obligatorio de tipo String, password obligatorio tipo String y rol con valor default "student" de tipo String. Este documento exporta el modelo con nombre "User" y el esquema definido.

    2. room.model.js: es un esquema de MongoDB con name obligatorio de tipo String, password obligatorio tipo String, description de tipo String, open de tipo boolean, date de tipo Date con valor por defecto el día actual, y log de tipo clave-valor (logId: tipo nativo id, userId: tipo nativo de id, username: tipo String, mark: de tipo Number con valor por defecto -1). Este documento exporta el modelo con nombre "Room" y el esquema definido.

    3. log.model.js: es un esquema de MongoDB con userId obligatorio de tipo id nativo de mongo y que hace referencia al id de "User", type obligatorio tipo String con los posibles valores simulacion y evaluacion, sessionId obligatorio, único y de tipo String, fixedParams (sin definir contenido), params de tipo clave-valor (time:Date, params:{}) con valor por defecto [], finished de tipo boolean con valor por defecto false, simulator obligatorio de tipo String cuyos valores posibles son los definidos en libs/simuladores.js, y room no obligatorio, de tipo id nativo de room, que hace referencia a Room. Este documento exporta el modelo con nombre "Log" y el esquema definido.


6. **controllers**
    1. user.controller.js: define las funciones para hacer login, cambio de contraseña, obtener a todos los usuarios, crear usuarios (que requiere de una funcion privada del propio documento para crear usuario), eliminar usuario y eliminar usuarios (en comentarios también esta conseguir usuario por id y conseguir el id del usuario). Encripta las contraseñas y permite comparar el guardado y el recibido con la libreria bcryptjs.
        - login: con la llegada name y password desde res.body, si el name y su password es correcta, mete en res.coockie el token dentro de "token" con diferentes caracteristicas de proteccion, segurdiad... y devuelve res.status(200).json({ status: 200, user: { id: userFound._id, name: userFound.name, role: userFound.role }, token});
        - logout: limpia la cookie de token y devuelve status 200.
        - changePassword: error en caso de que no se envíe parámetros o falte alguno, estos parámetros son userId, oldPassword, newPassword. Si el userId existe y su oldPassword es la existente, encripta la nueva contraseña y le introduce en el usuario (necesitará un user.save()). Si todo es correcto devuelve status 200.
        - getAllUsers: recupera todo el model de User ordenado por rol, excluyendo el usuario que ha hecho la peticion. Excluye al cliente del listado de busqueda. Si todo es correcto, devuelve status 200 y listado de usuarios conformados por el id, el nombre y el rol.
        - createUser: será usada en createUsers, que se exportará. En esta se guarda un nuevo usuario con los datos name, password encriptada y role en caso de que se pasen estos datos en req.body, y en caso de que ese usuario no exista ya en la base. Devuelve el status 200 y el usuario con su _id, name y role una vez guardado en la base.
        - createUsers: se pasan unos usuarios que se se pasan a la funcion createUser. Se guarda lo que ésta retorna, y si el status devuelto no es 200, pasa al usuario creado al array userNotCreated. Si devuelve status 200 es que se ha creado correctamente, introduce a los usuarios al array usersCreated, y hace un return de status 200, del array usersCreated y del array usersNotCreated.
        - deleteUser: hace un findOneAndDelete del modelo user si coincide el userId del body introducido como parámetro, en caso de que se introduzca el parámetro correcto y exista en la base. En este caso retorna 200 y el usuario eliminado.
        - deleteUsers: hace un deleteMany del modelo user en el que el _id esté en el array introducido re.body.users. Si no hay coincidncias, sale error y mensaje. Si todo bien, devuelve status 200, y el deletedCount del usuario eleiminado (cuando se hace deleteMany lo que devuelve tiene esta propiedad).

    2. room.controller.js: define las funciones para crear sala, actualizar sala y eliminar sala (en comentarios también está abrir sala y cerrar sala).
        - create: se deben pasar por parámetro en req.body name, passwod, description y open para crear un obtejo room de mongodb. Devuelve status 200 y la sala creada.
        - update: se debe pasar por parametro en req.body roomId, name, description y open. Hace updateOne en el _id sea el roomId y se actualiza el name, description y open. Si mathcedCount del objeto guardado al hacer el updateOne es cero, se devuelve que no se ha encontrado la sala. Si no, devuelve status 200.
        - eliminate: se debe pasar por parametro en req.body el roomId. Se hace findOneAndDelete del room con _id roomId, y se hace deleteMany de los logs donde su room tenga el valor de roomId. Si todo ha ocurrido correctamnte, devuelve status 200 y el room eliminado.

    3. log.controller.js: define las funciones para iniciar log, guardar parametros, finalizar log, eliminar el log y obtener log por id.
        - initLog: para hacerlo necesita que req.body traiga params, fixedParams, simulator, type (con valor simulación o evaluacion) y roomId (aunque se usa mas alante en la función). Se meten los req.body.params en un array llamado params, se guarda el req.body.simulator en simulator y el req.body.fixedParams en fixedParams. Se crea el timestamp del momento actual, un string construido por id del usuario - timestamp que es usado para crear la sessionId encriptandolo con sha26.
            
            Si el type es evaluacion, hace findOne del room donde su _id coincida con req.body.roomId. Si la sala coincidente no está open, devuelve error y mensaje, si está open hace un findIndex donde se busca dentro de un array (room.logs) el índice del primer elemento que cumple la condición en que el userId del room.log sea req.userId (conformado desde el middleware previo a la accion de este archivo) para comprobar si ya hay un log con este user. En caso de que ya esté en otro log, devuelve error y mensaje. Si hasta ahora todo bien, contruye una variable llamada log, de clase Log del modelo de mongo, con el userId, type, sessionId, params, fixedParams y simulador introducido por parametros o por req.userId. Además establece que si el valor del type del log es evaluacion, añade el parametro romm con el valor req.body.rommId. Si es simulación, como el parametro room de Log no es obligatorio, éste no se añade.
        
        - saveParams: recibe sessionId y params de req.body. Hace un findOneAndUPdate donde la sessionId tenga el valor req.body.sessionId, y actualiza los parametros con un push de cada param dentro de req.body.params. Es decir, añade más parametros al log. El log actualizado se guarda en log para comprobar si este existe, es decir si se ha actualizado realmente. Si no se ha actualizado, devuelve error y mensaje, si no hay problema devuelve status 200.
        - endLog: recibe seesionId y params de req.body. Hace un findOneAndUpdate donde la sessionId tenga el valor req.body.sessionId (aunque lo escribe más sencillo) y finished sea false, y actualiza los parametros con un push de igual manera que la función anterior, y establece finished como true.

            Si el type del log actualizado es evaluación hace findById del user cuyo _id sea userId (procedente de req.userId). Si no hay coincidencia devuelve error y mensaje. Si existe, hace findOneAndUpdate en room donde el _id sea el log.room del log actualizado, y actualiza los logs de room con logId con el valor log._id, el userId pasado en req, y el userName con user.name del user encontrado con el findById. Si todo bien, devuelve estatus 200.

        - deleteLog: recibe sessionId y roomId (aunque se usa más adelante en la función) por req.body. Hace findOneAnDelete donde la sessionId tenga el valor pasado por req.body y donde finished sea false. Si no se puede, devuelve error y mensaje. Si el log.type es evaluacion hace findOneAndUpdate de room donde su _id sea el roomId pasado por req.body y en ese caso elimina en room.logs el log cuyo logId sea log._id. Si todo bien devuelve status 200.
        - getLogByid: recibe req.query.logId (generalmente query es porque se hace una busqueda en la propia ruta api). Se hace un findById en log con ese logId, y si lo encuentra devuelve status 200 y el log encontrado.

7. **routes**

Las peticiones post se usan para crear o enviar datos al servidor (el cuerpo del request se envía en req.body). Las peticiones put se usan para actualizar datos, en general cualquier request que reemplaza o modifica recursos. Las peticiones get se usan para recuperar datos, sin modificar nada en el servidor (los parámetros opcionales se pasan en req.query (query params) o en la URL (req.params)). Las peticiones delete se usan para eliminar recursos.

1. user.routes.js: direcciones para api de funciones user.controller.
2. room.routes.js: direcciones para api de funciones room.controller.
3. log.routes.js: direcciones para api de funciones log.controller.