import React, { useState } from "react";
import Shortcuts from "../../../components/settingParts/Shortcuts";
import AdjustTheme from "../../../components/settingParts/AdjustTheme";
import LeftAsideLayout from "../../../layouts/leftAside";
import LeftPanel from "./LeftPanel";

const Settings = () => {
  const [selected, setSelected] = useState(0);

  const handleSelect = (key) => {
    setSelected(key);
  };

  return (
    <LeftAsideLayout isShowRightAside={false}>
      <LeftPanel handleSelect={handleSelect} />
      {(() => {
        switch (selected) {
          case 3:
            return <AdjustTheme />;
            break;
          case 6:
            return <Shortcuts />;
            break;

          default:
            break;
        }
      })()}
    </LeftAsideLayout>
  );
};

export default Settings;
