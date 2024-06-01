import { useDispatch, useSelector } from "react-redux";
import Conversation from "../../../components/conversation";
import LeftAsideLayout from "../../../layouts/leftAside";
import Chats from "./Chats";
import { selectSidebar, updateShowCvsComp } from "../../../redux/app/appSlice";
import Contact from "../../../components/sidebar/Contact";
import SharedMessages from "../../../components/sidebar/SharedMessages";
import StarredMessages from "../../../components/sidebar/StarredMessages";

const DirectChat = () => {
  const sidebar = useSelector(selectSidebar);
  const dispatch = useDispatch();
  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
  };
  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Chats />
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

export default DirectChat;
