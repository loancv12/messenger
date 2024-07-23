import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  TextField,
  styled,
} from "@mui/material";
import { Image, File } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/app/appSlice";
import { getFileFormat } from "../utils/getFileFormat";
import { maxNumberOfFiles } from "../config";

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

function classifyFile(files, allowFiles, maxSize) {
  return Array.from(files).filter((file, i) => {
    const fileFormat = getFileFormat(file.name);
    const isValidFormat = allowFiles.includes(fileFormat);
    const isValidSize = Math.round(file.size / 1024) <= maxSize;
    // Forgive this stupid naming, couldn't find a better name
    const isSingleFileAllowed = i <= maxNumberOfFiles;

    return isValidSize && isValidFormat && isSingleFileAllowed;
  });
}

function InputHidden({ setFiles, name, allowFiles, maxSize }) {
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { files } = e.target;
    const filteredFiles = classifyFile(files, allowFiles, maxSize);

    if (filteredFiles.length !== files.length) {
      dispatch(
        showSnackbar({
          severity: "error",
          message:
            "Files size must smaller than 1MB and only allowed file type: MS docs, MS excel, image. Max number of files can upload is 10",
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
        <File size={24} />
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
