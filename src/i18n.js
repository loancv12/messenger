import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { allLangs, defaultLang } from "./config";
import Backend from "i18next-http-backend";

const langStorage = localStorage.getItem("i18nextLng");

const currentLang =
  allLangs.find((_lang) => _lang.value === langStorage) || defaultLang;

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // resources,
    backend: {
      loadPath: "/locales/{{lng}}/translate.json",
    },
    lng: currentLang.value, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;
