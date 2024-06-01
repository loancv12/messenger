import React from "react";
import { TextField, styled } from "@mui/material";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "13px",
    paddingBottom: "13px",
    paddingRight: "12px",
    // borderRadius: "10px",
  },
}));

export default StyledInput;
