import React from "react";
import USAFlag from "./USAFlag";
import VNFlag from "./VNFlag";
import ChinaFlag from "./ChinaFlag";
import ArabicSaudiFlag from "./ArabicSaudiFlag";

export const FlagIcon = ({ type }) => {
  switch (type) {
    case "en":
      return <USAFlag />;
    case "vn":
      return <VNFlag />;
    case "cn":
      return <ChinaFlag />;
    case "ar":
      return <ArabicSaudiFlag />;
    default:
      throw new Error("this type not support");
      break;
  }
};
