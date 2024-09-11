import { Avatar } from "@mui/material";
import React from "react";

export default function StyleAvatar({ avatar, fullName, ...other }) {
  return (
    <Avatar
      src={avatar ?? "/images/default-avatar/jpg"}
      alt={fullName}
      {...other}
    />
  );
}
