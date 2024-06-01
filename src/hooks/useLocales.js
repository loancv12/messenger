import { useTranslation, initReactI18next } from "react-i18next";
import useSettings from "./useSettings";
// config
import { allLangs, defaultLang } from "../config";

// ----------------------------------------------------------------------

export default function useLocales() {
  const { t: translate, i18n } = useTranslation();

  const { onChangeDirectionByLang } = useSettings();

  const langStorage = localStorage.getItem("i18nextLng");
  const currentLang =
    allLangs.find((_lang) => _lang.value === langStorage) || defaultLang;

  const handleChangeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("i18nextLng", e.target.value);
    onChangeDirectionByLang(e.target.value);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLangs,
  };
}
