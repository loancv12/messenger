import { useDispatch, useSelector } from "react-redux";
import Conversation from "../../../components/conversation";
import LeftAsideLayout from "../../../layouts/leftAside";
import {
  selectSidebar,
  setChatType,
  updateShowCvsComp,
} from "../../../redux/app/appSlice";
import {
  Contact,
  SharedMessages,
  StarredMessages,
} from "../../../components/sidebar";
import Group from "./Group";
import { useEffect, useRef } from "react";
import { chatTypes } from "../../../redux/config";
import { Outlet, useNavigate } from "react-router-dom";
import { selectCurrCvsIdDefinedChatType } from "../../../redux/conversation/conversationSlice";

const GroupChat = () => {
  const dispatch = useDispatch();
  const sidebar = useSelector(selectSidebar);
  const currentCvsId = useSelector((state) =>
    selectCurrCvsIdDefinedChatType(state, chatTypes.GROUP_CHAT)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (currentCvsId) {
      navigate(currentCvsId);
    }
  }, []);

  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Group />
      <Outlet context={{ chatType: chatTypes.GROUP_CHAT }} />

      {(() => {
        switch (sidebar.type) {
          case "CONTACT":
            return <Contact />;
          case "SHARED":
            return <SharedMessages />;
          case "STARRED":
            return <StarredMessages />;
          default:
            break;
        }
      })()}
    </LeftAsideLayout>
  );
};

export default GroupChat;
