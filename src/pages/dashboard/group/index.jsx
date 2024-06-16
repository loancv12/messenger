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
import { useEffect } from "react";
import { chatTypes } from "../../../redux/config";

const GroupChat = () => {
  const sidebar = useSelector(selectSidebar);
  const dispatch = useDispatch();
  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
  };

  useEffect(() => {
    dispatch(selectTypeOfCvs({ chatType: chatTypes.GROUP_CHAT }));
  }, []);

  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Group />
      <Conversation handleBack={handleBack} />
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
