import { chatTypes } from "../redux/config";

export function path(...smallPaths) {
  return smallPaths.join("");
}

export const dynamics = {
  call: ":roomId/",
  cvs: ":cvsId/",
};

const ROOTS_DASHBOARD = "/";

export const generalPath = {
  app: path(ROOTS_DASHBOARD, "direct-chat/"),
  profile: path(ROOTS_DASHBOARD, "profile/"),
  setting: path(ROOTS_DASHBOARD, "settings/"),
  [chatTypes.DIRECT_CHAT]: path(ROOTS_DASHBOARD, "direct-chat/"),
  [chatTypes.GROUP_CHAT]: path(ROOTS_DASHBOARD, "group-chat/"),
  call: path(ROOTS_DASHBOARD, "call/"),
  notFound: path(ROOTS_DASHBOARD, "404/"),
};

export const specificPath = {
  waitRoom: "wait-room/",
  callRoom: "call-room/",
  adjustTheme: "adjust-theme/",
  shortcuts: "shortcuts/",
};
