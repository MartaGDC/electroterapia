import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
    .use(initReactI18next) // integración con react
    .use(LanguageDetector) // detecta el idioma del navegador
    .use(HttpApi) // carga traducciones del backend
    .init({
        fallbackLng: 'es', // idioma por defecto
        interpolation: { escapeValue: false }, // no escapar caracteres especiales
        backend: {
            loadPath: '/assets/locales/{{lng}}/translation.json',  // está en public/assets/locales
        },
        react: { useSuspense: false }, // para evitar problemas con la carga de datos asíncrona
    });
export default i18n; // exportar la configuración de i18n