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
import { showSnackbar } from "../../redux/app/appSlice";
import { getFileFormat } from "../../utils/getFileFormat";
import { allowFileTypes, maxNumberOfFiles, maxSize } from "../../config";
import { VisuallyHiddenInput } from "../common/VisuallyHiddenInput";
import { filterValidFiles } from "../../utils/checkValidFile";

function InputHidden({ setFiles, name }) {
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { files } = e.target;
    const filteredFiles = filterValidFiles(
      files,
      allowFileTypes,
      maxNumberOfFiles,
      maxSize
    );

    if (filteredFiles.length !== files.length) {
      dispatch(
        showSnackbar({
          severity: "error",
          message:
            "Files size must smaller than 1MB and only allowed file type: image with ext is .png .jpg .jpeg. Max number of files can upload is 10",
        })
      );
    }

    setFiles(filteredFiles);

    // 👇️ reset the file input
    e.target.value = null;
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
