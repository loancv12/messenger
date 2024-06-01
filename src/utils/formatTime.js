import { format, getTime, formatDistanceToNow } from "date-fns";
import { allLangs } from "../config";
import { defaultLang } from "../config";
// ----------------------------------------------------------------------
const currentLangValue =
  localStorage.getItem("i18nextLng") ?? defaultLang.value;
const { currentLocale } = allLangs?.find(
  (lang) => lang.value === currentLangValue
);

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

const isSameDate = (date1, date2) => {
  date1 = new Date(date1);
  date2 = new Date(date2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export function fDateFromNow(date) {
  date = new Date(date);
  const now = new Date();
  return isSameDate(date, now)
    ? `${date.getHours()}:${date.getMinutes()}`
    : date.toLocaleString(currentLocale);
}

export function fRelativeDate(date) {
  date = new Date(date);
  const now = new Date();
  const fDate = new Intl.DateTimeFormat(currentLocale, {}).format(date);
  return isSameDate(date, now)
    ? `${date.getHours()}:${date.getMinutes()}`
    : fDate;
}
