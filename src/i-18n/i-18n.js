import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import uzb from "./locales/uzb.json";
const storedLanguage = localStorage.getItem('language');
const language = storedLanguage || "uzb";

const resources = {
  en: en,
  ru: ru,
  uzb: uzb,
};

i18n.use(initReactI18next).init({
  resources,
  lng: language,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
