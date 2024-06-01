// app config
export const sidebarTypes = {
  CONTACT: "CONTACT", //default
  STARRED: "STARRED",
  SHARED: "SHARED",
};

export const chatTypes = {
  DIRECT_CHAT: "direct_chat", //default
  GROUP_CHAT: "group_chat",
};

export const noticeTypes = {
  [chatTypes.DIRECT_CHAT]: "new_msg_direct_conversation",
  [chatTypes.GROUP_CHAT]: "new_msg_group_conversation",
  FRIEND_REQ: "friend_req",
  JOIN_GROUP_REQ: "join_group_req",
};
