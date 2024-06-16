import {
  Badge,
  Box,
  Button,
  ImageList,
  ImageListItem,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFileFormat } from "../../utils/getFileFormat";

const PreviewFiles = ({ variant, files, handleDelete }) => {
  const theme = useTheme();
  const [formattedFile, setFormattedFile] = useState([]);

  useEffect(() => {
    let isCancel = false;
    let imgUrls = [];
    if (files?.length) {
      const formatFiles = Array.from(files).reduce((formatFiles, file) => {
        if (getFileFormat(file.name) === "image") {
          const imgUrl = URL.createObjectURL(file);
          imgUrls.push(imgUrl);
          formatFiles.push({
            type: "img",
            url: imgUrl,
            file,
            title: file.name,
          });
        } else {
          formatFiles.push({
            type: "doc",
            file,
            title: file.name,
          });
        }
        return formatFiles;
      }, []);

      setFormattedFile(formatFiles);
    }

    return () => {
      isCancel = true;
      imgUrls.forEach((imgUrl) => {
        URL.revokeObjectURL(imgUrl);
      });
    };
  }, [files]);

  return (
    <Paper
      sx={{
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
        position: "absolute",
        left: "56px",
        right: 0,
        top: 0,
        zIndex: 2,
        transform: "translateY(calc(-100% - 16px))",
      }}
    >
      {formattedFile?.length ? (
        <Stack
          direction={"row"}
          p={"10px"}
          spacing={1}
          justifyContent={"flex-start"}
          flexWrap={"nowrap"}
          alignItems={"center"}
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          {formattedFile.map((item, i) => (
            <Stack key={i}>
              <Badge
                onClick={() => handleDelete(item)}
                badgeContent={"X"}
                color="primary"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  "& span": {
                    cursor: "Pointer",
                  },
                }}
              >
                {item.type === "img" ? (
                  <img
                    src={item.url}
                    style={{
                      objectFit: "cover",
                      width: "56px",
                      height: "56px",
                      flexShrink: 0,
                      flexGrow: 0,
                    }}
                    alt={item.title}
                    loading="lazy"
                  />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.625rem",
                      padding: "5px 0",
                      maxWidth: "100px",
                      height: "56px",
                      wordBreak: "break-word",
                      overflow: "hidden",
                      display: "-webkit-box",
                      // WebkitAppearance: "slider-vertical",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.title}
                  </Typography>
                )}
              </Badge>
              <LinearProgress variant={variant} color="primary" value={0} />
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Paper>
  );
};

export default PreviewFiles;
