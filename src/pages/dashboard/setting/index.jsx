import React, { useState } from "react";
import Shortcuts from "../../../components/settingParts/Shortcuts";
import AdjustTheme from "../../../components/settingParts/AdjustTheme";
import LeftAsideLayout from "../../../layouts/leftAside";
import LeftPanel from "./LeftPanel";
import { Outlet, useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    navigate(path);
  };

  return (
    <LeftAsideLayout isShowRightAside={false}>
      <LeftPanel handleSelect={handleSelect} />
      <Outlet />
    </LeftAsideLayout>
  );
};

export default Settings;
