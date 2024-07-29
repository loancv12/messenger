import { useDispatch, useSelector } from "react-redux";
import Conversation from "../../../components/conversation";
import LeftAsideLayout from "../../../layouts/leftAside";
import {
  selectSidebar,
  selectTypeOfCvs,
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
import { selectCurrCvsId } from "../../../redux/conversation/conversationSlice";

const GroupChat = () => {
  const dispatch = useDispatch();
  const sidebar = useSelector(selectSidebar);
  const currentCvsId = useSelector((state) =>
    selectCurrCvsId(state, chatTypes.GROUP_CHAT)
  );
  const navigate = useNavigate();

  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
  };

  useEffect(() => {
    dispatch(selectTypeOfCvs({ chatType: chatTypes.GROUP_CHAT }));
    if (currentCvsId) {
      navigate(currentCvsId);
    }
  }, []);

  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Group />
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

export default GroupChat;
