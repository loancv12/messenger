// @mui
import { enUS, frFR, zhCN, viVN, arSD } from "@mui/material/locale";

// routes
import { generalPath } from "./routes/paths";

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://messenger-api-5sq8.onrender.com";

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
];

// https://toolsfairy.com/tools/image-test/sample-xbm-files#
export const imageFileTypesWithMIME = [
  { extension: ".heic", mimeType: "image/heic", notWideSp: true }, // =>not show not type
  { extension: ".heif", mimeType: "image/heif", notWideSp: true }, // 5m not show not type
  { extension: ".jp2", mimeType: "image/jp2", notWideSp: true }, // not show not type
  {
    extension: ".psd",
    mimeType: "image/vnd.adobe.photoshop",
    notWideSp: true,
  }, // not show not type
  { extension: ".tiff", mimeType: "image/tiff", notWideSp: true }, // not show, have type
  //
  { extension: ".webp", mimeType: "image/webp", notWideSp: true }, //
  { extension: ".jfif", mimeType: "image/jpeg" }, //
  { extension: ".jpeg", mimeType: "image/jpeg" }, //
  { extension: ".jpg", mimeType: "image/jpeg" },
  { extension: ".png", mimeType: "image/png" }, //
];

export const wordFileTypesWithMIME = [
  { extension: ".doc", mimeType: "application/msword" },
  {
    extension: ".docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
];

export const allowFileTypes = [
  ...imageFileTypesWithMIME,
  ...wordFileTypesWithMIME,
];

// export const allowFileExts = [, ".doc", ".docx"];
// const imageMimeType = ["image/jpg", "image/jpeg", "image/png", "image/bmp"];

export const maxSize = 1024 * 1024 * 1; // 1e6 (1 MB-1024kB)
export const maxNumberOfFiles = 6;

export const msgsLimit = 20;
export const msgInterval = 30;

export const defaultLang = allLangs[0]; // English

// DEFAULT ROOT PATH
export const DEFAULT_PATH = generalPath.app; // as '/app'
