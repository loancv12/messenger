import { useSelector } from "react-redux";
import LeftAsideLayout from "../../../layouts/leftAside";
import Direct from "../../../components/direct/Direct";
import { selectSidebar } from "../../../redux/app/appSlice";
import Contact from "../../../components/sidebar/Contact";
import SharedMessages from "../../../components/sidebar/SharedMessages";
import StarredMessages from "../../../components/sidebar/StarredMessages";
import { Outlet } from "react-router-dom";

const DirectChat = () => {
  const sidebar = useSelector(selectSidebar);

  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Direct />
      {/* <DirectMsgs /> */}
      <Outlet />
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
