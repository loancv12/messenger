import { useDispatch, useSelector } from "react-redux";
import LeftAsideLayout from "../../../layouts/leftAside";
import { selectSidebar } from "../../../redux/app/appSlice";
import {
  Contact,
  SharedMessages,
  StarredMessages,
} from "../../../components/sidebar";
import Group from "../../../components/group/Group";
import { Outlet } from "react-router-dom";

const GroupChat = () => {
  const sidebar = useSelector(selectSidebar);

  return (
    <LeftAsideLayout isShowRightAside={sidebar.open}>
      <Group />
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

export default GroupChat;
