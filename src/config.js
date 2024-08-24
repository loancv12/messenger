// @mui
import { enUS, frFR, zhCN, viVN, arSD } from "@mui/material/locale";

// routes
import { generalPath } from "./routes/paths";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const defaultSettings = {
  themeMode: "light",
  themeDirection: "ltr",
  themeContrast: "default",
  themeLayout: "horizontal",
  themeColorPresets: "default",
  themeStretch: false,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const allLangs = [
  {
    label: "English",
    value: "en",
    systemValue: enUS,
    locale: "en-US",
    icon: "/assets/icons/flags/ic_flag_en.svg",
  },

  {
    label: "Vietnamese",
    value: "vn",
    systemValue: viVN,
    locale: "vi-VN",
    icon: "/assets/icons/flags/ic_flag_vn.svg",
  },
  {
    label: "Chinese",
    value: "cn",
    systemValue: zhCN,
    locale: "zh-CN",
    icon: "/assets/icons/flags/ic_flag_cn.svg",
  },
  {
    label: "Arabic (Sudan)",
    value: "ar",
    systemValue: arSD,
    locale: "ar-SD",
    icon: "/assets/icons/flags/ic_flag_sa.svg",
  },
];

export const allowFileTypes = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const allowFileExts = [".png", ".jpg", ".jpeg", ".doc", ".docx"];

export const maxSize = 1024 * 1024 * 1; // 1e6 (1 MB-1024kB)
export const maxNumberOfFiles = 10;

export const msgsLimit = 20;

export const defaultLang = allLangs[0]; // English

// DEFAULT ROOT PATH
export const DEFAULT_PATH = generalPath.app; // as '/app'
