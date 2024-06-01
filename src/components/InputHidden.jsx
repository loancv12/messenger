import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  TextField,
  styled,
} from "@mui/material";
import { Image } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/app/appSlice";
const VisuallyHiddenInput = styled("input")(({ theme }) => ({
  "& .MuiInputBase-input, fieldset": {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  },
  "&": {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  },
}));

const fileExt = {
  img: "^image/.*$",
  video: "video/*",
  msDoc:
    "^application/(msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$",
  txt: "text/*",
  msEx: "application/(vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$",
};

function makeRegex(type) {
  const regex = new RegExp(`${fileExt[type]}`);
  return regex;
}

function validFileType(file, type) {
  return file.type.match(makeRegex(type));
}

// classify files to format : { [type]:[File]}
function classifyFile(files, allowFiles, maxSize) {
  let result = [];
  result = Array.from(files).filter((file) => {
    return allowFiles.find((type) => {
      console.log("file size", file.size);
      const isValidType = validFileType(file, type);
      1049221 / 102;
      const isValidSize = Math.round(file.size / 1024) < maxSize;
      return isValidSize && isValidType;
    });
  });
  return result;
}

function InputHidden({ setFiles, name, icon, allowFiles, maxSize }) {
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { files } = e.target;
    const filteredFiles = classifyFile(files, allowFiles, maxSize);

    if (filteredFiles.length !== files.length) {
      dispatch(
        showSnackbar({
          severity: "error",
          message:
            "Files size must smaller than 1MB and only allowed file type: MS docs, MS excel, image",
        })
      );
    }

    setFiles(filteredFiles);
  };

  return (
    <>
      <Button
        sx={{
          backgroundColor: "transparent",
          padding: 0,
          // minWidth: "24px",
          // height: "24px",
          width: "56px",
          height: "56px",
          minHeight: "36px",
          minWidth: 0,
          borderRadius: "inherit",
          "&:hover": { backgroundColor: "transparent" },
          boxShadow: "none",
          color: "inherit",
        }}
        variant="contained"
        component="label"
      >
        {icon}
        <VisuallyHiddenInput
          type="file"
          name={name}
          multiple
          onChange={handleChange}
        />
      </Button>
    </>
  );
}

export default InputHidden;
