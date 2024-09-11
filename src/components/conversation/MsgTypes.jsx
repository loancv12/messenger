import {
  Avatar,
  AvatarGroup,
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
  Slide,
  Stack,
  styled,
  Typography,
  useMediaQuery,
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
import {
  setReplyMessage,
  reactMessage,
  forwardMessage,
  starMessage,
  reportMessage,
  deleteMessage,
  selectSentSuccess,
  selectReadUserIds,
} from "../../redux/message/messageSlice";
import { faker } from "@faker-js/faker";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ShowImage from "./ShowImage";
import useAuth from "../../hooks/useAuth";

// msg types component
export const DocMsg = memo(
  ({
    el,
    menu,
    isLastMsg,
    handleGetToRepMsg,
    lastReadUserIdsOfMsg,
    prevLastReadMsgIds,
    fromUserIdsOfMsg,
    getMap,
  }) => {
    const theme = useTheme();
    function download({ files }) {
      const { link: url, alt: name } = files[0];
    }

    return (
      <Box
        data-ref={el.id}
        sx={{ scrollMarginTop: "20px" }}
        ref={(node) => {
          const map = getMap();
          // Add to the Map
          if (node) {
            // Add to the Map
            map.set(el.id, node);
          } else {
            // Remove from the Map
            map.delete(el.id);
          }
        }}
      >
        {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          {el.incoming ? (
            fromUserIdsOfMsg && fromUserIdsOfMsg.length ? (
              <Avatar
                alt={fromUserIdsOfMsg}
                src={faker.image.avatar()}
                // src={faker.image.avatar()}
                sx={{
                  width: 28,
                  height: 28,
                }}
              />
            ) : (
              <div style={{ width: "28px" }}></div>
            )
          ) : null}
          <Stack
            data-ref={el.id}
            direction="row"
            justifyContent={el.incoming ? "start" : "end"}
            sx={{ position: "relative", width: "100%" }}
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
                    <IconButton onClick={() => download(el)}>
                      <DownloadSimple />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            )}
            {menu && <MessageOptions msg={el} />}
            <BadgeSign
              {...{
                lastReadUserIdsOfMsg,
                el,
                isLastMsg,
                prevLastReadMsgIds,
                getMap,
              }}
            />
          </Stack>
        </Stack>
      </Box>
    );
  }
);

export const LinkMsg = memo(
  ({
    el,
    menu,
    isLastMsg,
    handleGetToRepMsg,
    lastReadUserIdsOfMsg,
    prevLastReadMsgIds,
    fromUserIdsOfMsg,
    getMap,
  }) => {
    const theme = useTheme();

    return (
      <Box
        data-ref={el.id}
        sx={{ scrollMarginTop: "20px" }}
        ref={(node) => {
          const map = getMap();
          // Add to the Map
          if (node) {
            // Add to the Map
            map.set(el.id, node);
          } else {
            // Remove from the Map
            map.delete(el.id);
          }
        }}
      >
        {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          {el.incoming ? (
            fromUserIdsOfMsg && fromUserIdsOfMsg.length ? (
              <Avatar
                alt={fromUserIdsOfMsg}
                src={faker.image.avatar()}
                // src={faker.image.avatar()}
                sx={{
                  width: 28,
                  height: 28,
                }}
              />
            ) : (
              <div style={{ width: "28px" }}></div>
            )
          ) : null}
          <Stack
            data-ref={el.id}
            direction="row"
            justifyContent={el.incoming ? "start" : "end"}
            sx={{ position: "relative", width: "100%" }}
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
            <BadgeSign
              {...{
                lastReadUserIdsOfMsg,
                el,
                isLastMsg,
                prevLastReadMsgIds,
                getMap,
              }}
            />
          </Stack>
        </Stack>
      </Box>
    );
  }
);

const topLeft = (i) => i === 1 - 1;
const topRight = (i, col) => i === col - 1;
const bottomLeft = (i, col, row) => i === col * (row - 1) + 1 - 1;
const bottomRight = (i, col, row) => i === col * row - 1;
const calculateCss = (numOfFile, matchDownMd) => {
  const col = numOfFile <= 2 ? numOfFile : 3;
  const row = numOfFile <= 2 ? 1 : Math.ceil(numOfFile / 3);

  const rowHeight =
    numOfFile <= 2 ? (col === 2 ? 100 : 200) : matchDownMd ? 80 : 100;
  const imageListWidth =
    numOfFile <= 2
      ? 200 + (col - 1) * 4
      : matchDownMd
      ? 80 * 3 + 4 * 2
      : 100 * 3 + 4 * 2;
  const imageListHeight =
    numOfFile <= 2
      ? rowHeight
      : matchDownMd
      ? row * 80 + (row - 1) * 4
      : row * 100 + (row - 1) * 4;
  const imgWidth = rowHeight;
  const imgHeight = rowHeight;

  return {
    row,
    col,
    rowHeight,
    imageListWidth,
    imageListHeight,
    imgWidth,
    imgHeight,
  };
};
export const MediaMsg = memo(
  ({
    el,
    menu,
    isLastMsg,
    handleGetToRepMsg,
    lastReadUserIdsOfMsg,
    prevLastReadMsgIds,
    fromUserIdsOfMsg,
    getMap,
  }) => {
    const theme = useTheme();

    let imgs;
    const numOfFile = el.files.length;
    const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
    const {
      row,
      col,
      rowHeight,
      imageListWidth,
      imageListHeight,
      imgWidth,
      imgHeight,
    } = calculateCss(numOfFile, matchDownMd);

    imgs = (
      <ImageList
        sx={{
          width: imageListWidth,
          height: imageListHeight,
          margin: 0,
          overflow: "hidden",
        }}
        cols={col}
        rowHeight={rowHeight}
      >
        {el.files.map((file, i) => {
          return (
            <ImageListItem
              key={file._id}
              sx={{
                width: imgWidth,
                height: imgHeight,
                maxHeight: imgHeight,
              }}
            >
              <ShowImage link={file.link} alt={file.alt} type>
                <img
                  src={file.link}
                  alt={file.alt}
                  loading="lazy"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    maxHeight: "100%",
                    borderTopLeftRadius: topLeft(i) ? "10px" : "4px",
                    borderTopRightRadius: topRight(i, col) ? "10px" : "4px",
                    borderBottomLeftRadius: bottomLeft(i, col, row)
                      ? "10px"
                      : "4px",
                    borderBottomRightRadius: bottomRight(i, col, row)
                      ? "10px"
                      : "4px",
                    objectFit: "cover",
                  }}
                />
              </ShowImage>
            </ImageListItem>
          );
        })}
      </ImageList>
    );
    return (
      <Box
        data-ref={el.id}
        sx={{ scrollMarginTop: "20px" }}
        ref={(node) => {
          const map = getMap();
          // Add to the Map
          if (node) {
            // Add to the Map
            map.set(el.id, node);
          } else {
            // Remove from the Map
            map.delete(el.id);
          }
        }}
      >
        {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          {el.incoming ? (
            fromUserIdsOfMsg && fromUserIdsOfMsg.length ? (
              <Avatar
                alt={fromUserIdsOfMsg}
                src={faker.image.avatar()}
                // src={faker.image.avatar()}
                sx={{
                  width: 28,
                  height: 28,
                }}
              />
            ) : (
              <div style={{ width: "28px" }}></div>
            )
          ) : null}
          <Stack
            data-ref={el.id}
            direction="row"
            justifyContent={el.incoming ? "start" : "end"}
            sx={{ position: "relative", width: "100%" }}
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
                  maxWidth: { xs: "100%", md: "70%" },
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
            <BadgeSign
              {...{
                lastReadUserIdsOfMsg,
                el,
                isLastMsg,
                prevLastReadMsgIds,
                getMap,
              }}
            />
          </Stack>
        </Stack>
      </Box>
    );
  }
);

export const TextMsg = memo(
  ({
    el,
    menu,
    isLastMsg,
    handleGetToRepMsg,
    lastReadUserIdsOfMsg,
    prevLastReadMsgIds,
    fromUserIdsOfMsg,
    getMap,
  }) => {
    const theme = useTheme();
    return (
      <Box
        data-ref={el.id}
        sx={{ scrollMarginTop: "20px" }}
        ref={(node) => {
          const map = getMap();
          // Add to the Map
          if (node) {
            // Add to the Map
            map.set(el.id, node);
          } else {
            // Remove from the Map
            map.delete(el.id);
          }
        }}
      >
        {el?.isStartMsg ? <Timeline time={el?.timeOfStartMsg} /> : null}
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          {el.incoming ? (
            fromUserIdsOfMsg && fromUserIdsOfMsg.length ? (
              <Avatar
                alt={fromUserIdsOfMsg}
                src={faker.image.avatar()}
                // src={faker.image.avatar()}
                sx={{
                  width: 28,
                  height: 28,
                }}
              />
            ) : (
              <div style={{ width: "28px" }}></div>
            )
          ) : null}

          <Stack
            direction="row"
            justifyContent={el.incoming ? "start" : "end"}
            sx={{ position: "relative", width: "100%" }}
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
              </Box>
            )}

            {menu && <MessageOptions msg={el} />}
            <BadgeSign
              {...{
                lastReadUserIdsOfMsg,
                el,
                isLastMsg,
                prevLastReadMsgIds,
                getMap,
              }}
            />
          </Stack>
        </Stack>
      </Box>
    );
  }
);

// utilities component
export const Timeline = memo(({ time }) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems={"center"}
      justifyContent="space-between"
      marginBottom={"16px"}
    >
      <Divider sx={{ flex: 1 }} />
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text,
        }}
      >
        {time}
      </Typography>
      <Divider sx={{ flex: 1 }} />
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

const SlideAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "distance",
  name: "SlideAvatar",
})(({ theme, distance = 0 }) => ({
  "@keyframes slideIn": {
    from: {
      opacity: 1,
      bottom: `${distance - 16}px`,
    },
    to: {
      opacity: 1,
      bottom: "-16px",
    },
  },
  animation: "3s linear 0s forwards slideIn ",
}));

export const SentSuccessSign = memo(({ sentSuccess }) => {
  const compLookup = {
    success: CheckCircle,
    unset: CheckCircle,
    error: WarningCircle,
  };
  const Comp = compLookup[sentSuccess];
  return (
    <>
      <Comp
        size={12}
        color="#5e5e5e"
        style={{ position: "absolute", bottom: "4px", right: "4px" }}
        weight={sentSuccess === "success" ? "fill" : "regular"}
      />
    </>
  );
});

// prevent update sentSuccess run this component
export const ReadUserIdsSign = memo(
  ({
    lastReadUserIdsOfMsg,
    elId,
    elFrom,
    isLastMsg,
    prevLastReadMsgIds,
    getMap,
  }) => {
    return (
      <AvatarGroup max={4}>
        {lastReadUserIdsOfMsg.map((userId, i) => {
          if (
            prevLastReadMsgIds?.[userId] &&
            prevLastReadMsgIds?.[userId] !== elId &&
            userId !== elFrom
          ) {
            const map = getMap();
            const nodeOfPrevMsg = map.get(prevLastReadMsgIds?.[userId]);
            if (nodeOfPrevMsg) {
              const distance =
                nodeOfPrevMsg?.offsetParent?.clientHeight -
                (nodeOfPrevMsg?.offsetTop + nodeOfPrevMsg?.offsetHeight + 16); //16 for margin top

              return (
                <SlideAvatar
                  key={i}
                  alt={userId}
                  distance={distance}
                  src={faker.image.avatar()}
                  sx={{
                    width: 14,
                    height: 14,
                    position: "absolute",
                    right: `${0 + 20 * i}px`,
                  }}
                />
              );
            }
            {
              return (
                <Avatar
                  key={i}
                  alt={userId}
                  src={faker.image.avatar()}
                  sx={{
                    width: 14,
                    height: 14,
                    position: "absolute",
                    right: `${0 + 20 * i}px`,
                    bottom: "-16px",
                  }}
                />
              );
            }
          } else if (userId !== elFrom || !isLastMsg) {
            return (
              <Avatar
                key={i}
                alt={userId}
                src={faker.image.avatar()}
                sx={{
                  width: 14,
                  height: 14,
                  position: "absolute",
                  right: `${0 + 20 * i}px`,
                  bottom: "-16px",
                }}
              />
            );
          }
        })}
      </AvatarGroup>
    );
  }
);

export const BadgeSign = ({
  lastReadUserIdsOfMsg,
  el,
  isLastMsg,
  prevLastReadMsgIds,
  getMap,
}) => {
  const content =
    isLastMsg && lastReadUserIdsOfMsg?.length === 1 && !el.incoming ? ( // =>sender
      <SentSuccessSign sentSuccess={el.sentSuccess} />
    ) : lastReadUserIdsOfMsg?.length ? (
      <ReadUserIdsSign
        lastReadUserIdsOfMsg={lastReadUserIdsOfMsg}
        elId={el.id}
        elFrom={el.from}
        prevLastReadMsgIds={prevLastReadMsgIds}
        getMap={getMap}
        isLastMsg={isLastMsg}
      />
    ) : null;

  return content;
};
