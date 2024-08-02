import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  Link,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  DotsThreeVertical,
  DownloadSimple,
  Image,
  WarningCircle,
} from "phosphor-react";
import React, { useState, useRef, memo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fDateFromNow } from "../../utils/formatTime";
import {
  setReplyMessage,
  reactMessage,
  forwardMessage,
  starMessage,
  reportMessage,
  deleteMessage,
} from "../../redux/message/messageSlice";
import { faker } from "@faker-js/faker";
import useAxios from "../../hooks/useAxios";
import ShowImage from "./ShowImage";

// msg types component
export const DocMsg = memo(({ el, menu, isLastMsg, handleGetToRepMsg }) => {
  const theme = useTheme();
  return (
    <Box data-ref={el.id} sx={{ scrollMarginTop: "20px" }}>
      {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
      <Stack
        data-ref={el.id}
        direction="row"
        justifyContent={el.incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? (
          <ReplyMsg
            replyMsg={el.replyMsg}
            handleGetToRepMsg={handleGetToRepMsg}
          />
        ) : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: el.incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
            }}
            p={1}
          >
            <Stack spacing={2}>
              <Stack
                p={1}
                direction="row"
                spacing={3}
                alignItems={"center"}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1.5,
                }}
              >
                <Image size={48} />
                <Typography variant="caption">{el.files[0].alt}</Typography>
                <IconButton>
                  <DownloadSimple />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        )}
        {menu && <MessageOptions msg={el} />}
      </Stack>
    </Box>
  );
});

export const LinkMsg = memo(({ el, menu, isLastMsg, handleGetToRepMsg }) => {
  const theme = useTheme();

  return (
    <Box data-ref={el.id} sx={{ scrollMarginTop: "20px" }}>
      {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
      <Stack
        data-ref={el.id}
        direction="row"
        justifyContent={el.incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? (
          <ReplyMsg
            replyMsg={el.replyMsg}
            handleGetToRepMsg={handleGetToRepMsg}
          />
        ) : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: el.incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
            }}
            p={1}
          >
            <Stack
              p={1}
              spacing={2}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1.5,
              }}
            >
              sdda
              {/* <img
                src={el?.file}
                alt={el.text}
                style={{
                  maxHeight: 210,
                  borderRadius: "10px",
                }}
              /> */}
              <Typography
                variant="body2"
                to="//https://www.youtobe.com"
                color={el.incoming ? theme.palette.text : "#fff"}
                component={Link}
              >
                {el.text}
              </Typography>
            </Stack>
          </Box>
        )}
        {menu && <MessageOptions msg={el} />}
      </Stack>
    </Box>
  );
});

export const MediaMsg = memo(({ el, menu, isLastMsg, handleGetToRepMsg }) => {
  const theme = useTheme();

  let imgs;
  if (el.files.length <= 2) {
    const col = el.files.length;
    imgs = (
      <ImageList
        sx={{ width: 200, height: 200, margin: 0 }}
        cols={col}
        rowHeight={200}
      >
        {el.files.map((file, i) => (
          <ImageListItem key={i}>
            <ShowImage link={file.link} alt={file.alt}>
              <img
                src={file.link}
                alt={file.alt}
                loading="lazy"
                style={{
                  width: col === 2 ? "100px" : "200px",
                  height: col === 2 ? "100px" : "200px",
                  display: "block",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </ShowImage>
          </ImageListItem>
        ))}
      </ImageList>
    );
  } else {
    const row = Math.ceil(el.files.length / 3);
    const col = 3;
    const topLeft = (i) => i === 1 - 1;
    const topRight = (i) => i === 3 - 1;
    const bottomLeft = (i) => i === col * (row - 1) + 1 - 1;
    const bottomRight = (i) => i === col * row - 1;
    imgs = (
      <ImageList
        sx={{
          width: 300,
          height: row * 100 + (row - 1) * 4, //4px for gap
          margin: 0,
          overflow: "hidden",
        }}
        cols={col}
        rowHeight={100}
      >
        {el.files.map((file, i) => {
          return (
            <ImageListItem key={i}>
              <ShowImage link={file.link} alt={file.alt}>
                <img
                  src={file.link}
                  alt={file.alt}
                  loading="lazy"
                  style={{
                    display: "block",
                    width: "100px",
                    height: "100px",
                    maxHeight: 100,
                    borderTopLeftRadius: topLeft(i) ? "10px" : "4px",
                    MozBorderRadiusTopleft: topLeft(i) ? "10px" : "4px",

                    borderTopRightRadius: topRight(i) ? "10px" : "4px",
                    MozBorderRadiusTopright: topRight(i) ? "10px" : "4px",

                    borderBottomLeftRadius: bottomLeft(i) ? "10px" : "4px",
                    MozBorderRadiusBottomleft: bottomLeft(i) ? "10px" : "4px",

                    borderBottomRightRadius: bottomRight(i) ? "10px" : "4px",
                    MozBorderRadiusBottomright: bottomRight(i) ? "10px" : "4px",

                    objectFit: "cover",
                  }}
                />
              </ShowImage>
            </ImageListItem>
          );
        })}
      </ImageList>
    );
  }
  return (
    <Box data-ref={el.id} sx={{ scrollMarginTop: "20px" }}>
      {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
      <Stack
        data-ref={el.id}
        direction="row"
        justifyContent={el.incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? (
          <ReplyMsg
            replyMsg={el.replyMsg}
            handleGetToRepMsg={handleGetToRepMsg}
          />
        ) : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: el.incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
              maxWidth: "70%",
            }}
            p={1}
          >
            {imgs}
            {/* <a href={el.file} target="_blank" rel="noopener">
              <img
                src={el.file}
                alt={el.text}
                style={{
                  display: "block",
                  width: "200px",
                  height: "200px",
                  maxHeight: 300,
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
                loading="lazy"
              />
            </a> */}
          </Box>
        )}
        {menu && <MessageOptions msg={el} />}
      </Stack>
    </Box>
  );
});

export const TextMsg = memo(({ el, menu, isLastMsg, handleGetToRepMsg }) => {
  const theme = useTheme();
  return (
    <Box data-ref={el.id} sx={{ scrollMarginTop: "20px" }}>
      {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
      <Stack
        direction="row"
        justifyContent={el.incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? (
          <ReplyMsg
            replyMsg={el.replyMsg}
            handleGetToRepMsg={handleGetToRepMsg}
          />
        ) : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: el.incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
              zIndex: 1,
              maxWidth: "70%",
              // position: "relative",
            }}
            p={1}
          >
            <Typography
              variant="body2"
              color={el.incoming ? theme.palette.text : "#fff"}
            >
              {el.text}
            </Typography>

            {/* {el.unread ? (
              isLastMsg && !el.incoming ? (
                <Avatar
                  alt="Remy Sharp"
                  src={faker.image.avatar()}
                  sx={{
                    width: 14,
                    height: 14,
                    position: "absolute",
                    bottom: "4px",
                    right: "-18px",
                  }}
                />
              ) : null
            ) : null} */}
          </Box>
        )}
        {/* <Avatar
          alt="Remy Sharp"
          src={faker.image.avatar()}
          sx={{ width: 14, height: 14 }}
        /> */}
        {/* <WarningCircle size={32} color="#5e5e5e" weight="fill" style={{ position: "absolute", bottom: "4px", right: "-18px" }}/> */}
        {/* // <CheckCircle size={12} color="#5e5e5e" weight="fill" /> */}
        {menu && <MessageOptions msg={el} />}
        {isLastMsg && !el.unread ? (
          <Avatar
            alt="Remy Sharp"
            src={faker.image.avatar()}
            sx={{
              width: 14,
              height: 14,
              position: "absolute",
              bottom: "4px",
              right: "0",
            }}
          />
        ) : isLastMsg && !el.incoming ? (
          <CheckCircle
            size={12}
            color="#5e5e5e"
            style={{ position: "absolute", bottom: "4px", right: "4px" }}
            weight={el.sentSuccess === "success" ? "fill" : undefined}
          />
        ) : null}
      </Stack>
    </Box>
  );
});

// utilities component
export const Timeline = memo(({ time }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems={"center"} justifyContent="space-between">
      <Divider width="46%" />
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text,
        }}
      >
        {time}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
});

export const ReplyMsg = memo(({ replyMsg, handleGetToRepMsg }) => {
  const theme = useTheme();

  const scrollAndHightLightEl = (el) => {
    const svg = el.querySelector("svg");
    const divInside = svg.previousElementSibling;
    el.scrollIntoView({
      behavior: "smooth",
    });

    // divInside.style.transform = "scale(1.3)";
    divInside.style.boxShadow = "6px 4px 2px  rgb(255 0 0)";

    setTimeout(function () {
      divInside.style.transform = "none";
      divInside.style.boxShadow = "none";
    }, 3000);
  };

  const handleTrackMsg = async () => {
    const targetEl = document.querySelector(`[data-ref="${replyMsg?.id}"]`);

    if (targetEl) {
      scrollAndHightLightEl(targetEl);
    } else {
      await handleGetToRepMsg(replyMsg.createdAt);
      const targetEle = document.querySelector(`[data-ref="${replyMsg?.id}"]`);
      if (targetEle) {
        scrollAndHightLightEl(targetEle);
      }
    }
  };

  return (
    <Typography
      onClick={handleTrackMsg}
      sx={[
        {
          cursor: "Pointer",
          position: "absolute",
          top: 0,
          transform: "translateY(calc(-100% + 4px))",
          padding: "4px",
          fontSize: "0.7rem",
          backgroundColor: replyMsg.isSelfReply
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: "4px",
          zIndex: 0,
          //
          maxWidth: "150px",
          overflow: "hidden",
          display: "-webkit-box",
          // WebkitAppearance: "slider-vertical",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        },
        replyMsg.isMyReply
          ? { right: "0" }
          : {
              left: "-10px",
            },
      ]}
      variant="body2"
      color={replyMsg.isSelfReply ? theme.palette.text : "#fff"}
    >
      {replyMsg?.text}
    </Typography>
  );
});

export const DeletedMsg = memo(({ el }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: el.incoming ? theme.palette.background.default : "#fff",
          borderRadius: 1.5,
          width: "max-content",
        }}
        p={1}
      >
        <Typography variant="body2" color={theme.palette.grey[500]}>
          Message is deleted
        </Typography>
      </Box>
    </Stack>
  );
});

export const MsgSkeleton = () => {
  const theme = useTheme();
  const incoming = Math.round(Math.random());
  return (
    <Box>
      <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
        <Box
          sx={{
            backgroundColor: incoming
              ? theme.palette.background.default
              : theme.palette.primary.main,
            borderRadius: 1.5,
            width: "max-content",
            zIndex: 1,
            maxWidth: "70%",
            // position: "relative",
          }}
          p={1}
        >
          <Skeleton variant="rounded" width={150} height={38} />
        </Box>
      </Stack>
    </Box>
  );
};

export const Message_options = [
  {
    title: "Reply",
    onclick: setReplyMessage,
  },
  {
    title: "React to message",
    onclick: reactMessage,
  },
  {
    title: "Forward message",
    onclick: forwardMessage,
  },
  {
    title: "Star message",
    onclick: starMessage,
  },
  {
    title: "Report",
    onclick: reportMessage,
  },
  {
    title: "Delete Message",
    onclick: deleteMessage,
  },
];
export const MessageOptions = memo(({ msg }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMsg = ({ msg, onclick }) => {
    dispatch(onclick({ msg }));
    handleClose();
  };

  return (
    <>
      <DotsThreeVertical
        size={20}
        onClick={handleClick}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((el, i) => {
            return (
              <MenuItem
                onClick={() => handleMsg({ msg, onclick: el.onclick })}
                key={i}
              >
                {el.title}
              </MenuItem>
            );
          })}
        </Stack>
      </Menu>
    </>
  );
});
