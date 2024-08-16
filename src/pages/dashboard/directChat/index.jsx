import { useDispatch, useSelector } from "react-redux";
import Conversation from "../../../components/conversation";
import LeftAsideLayout from "../../../layouts/leftAside";
import Chats from "./Chats";
import {
  selectSidebar,
  setChatType,
  updateShowCvsComp,
} from "../../../redux/app/appSlice";
import Contact from "../../../components/sidebar/Contact";
import SharedMessages from "../../../components/sidebar/SharedMessages";
import StarredMessages from "../../../components/sidebar/StarredMessages";
import { useCallback, useEffect, useRef, useState } from "react";
import { chatTypes } from "../../../redux/config";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { selectCurrCvsIdDefinedChatType } from "../../../redux/conversation/conversationSlice";

const DirectChat = () => {
  const dispatch = useDispatch();
  const sidebar = useSelector(selectSidebar);
  const currentCvsId = useSelector((state) =>
    selectCurrCvsIdDefinedChatType(state, chatTypes.DIRECT_CHAT)
  );

  const navigate = useNavigate();

  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
  };

  useEffect(() => {
    dispatch(setChatType({ chatType: chatTypes.DIRECT_CHAT }));
    if (currentCvsId) {
      navigate(currentCvsId);
    }
  }, []);

  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Chats />
      {/* <DirectMsgs /> */}
      <Outlet handleBack={handleBack} />
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

export default DirectChat;
