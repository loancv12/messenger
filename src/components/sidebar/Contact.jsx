import {
  Box,
  Stack,
  IconButton,
  useTheme,
  Typography,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X,
} from "phosphor-react";
import { useDispatch } from "react-redux";
import { toggleSidebar, updateSidebar } from "../../redux/app/appSlice";
import { faker } from "@faker-js/faker";
import AntSwitch from "../common/AntSwitch";
import { useState } from "react";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ActionDialog = ({ open, handleClose, type }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      {type === "block" ? (
        <DialogTitle>Block this Contact</DialogTitle>
      ) : (
        <DialogTitle>Delete this Contact</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {`Are you sure to ${type} this contact`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose(type);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleClose(type);
          }}
        >
          yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpen = (type) => {
    type === "block" ? setOpenBlock(true) : setOpenDelete(true);
  };

  const handleClose = (type) => {
    type === "block" ? setOpenBlock(false) : setOpenDelete(false);
  };

  return (
    // <Box width={320} height="100vh">
    <Stack height={"100%"} width={"100%"}>
      {/* Header */}
      <Box
        sx={{
          boxShadow: "0 0 2px rgba(0,0,0,.25)",
          width: "100%",
          backgroundColor:
            theme.palette.mode === "light"
              ? "F8F8F8"
              : theme.palette.background.paper,
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          height={"100%"}
          p={2}
          spacing={2}
        >
          <Stack spacing={2} alignItems={"center"} direction={"row"}>
            <Avatar
              src={faker.image.avatar()}
              sx={{
                height: "40px",
                width: "40px",
              }}
              alt={faker.person.firstName()}
            />
            <Typography variant="article" fontWeight={600}>
              {faker.person.fullName()}
            </Typography>
          </Stack>

          <IconButton
            onClick={() => {
              dispatch(toggleSidebar());
            }}
          >
            <X />
          </IconButton>
        </Stack>
      </Box>
      {/* Body */}
      <Stack
        p={3}
        spacing={2}
        justifyContent={"flex-start"}
        sx={{
          height: "100%",
          // position: "relative",
          // flexGrow: 1,
          // overflowY: "auto",
          minHeight: 0,
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Button
              sx={{
                color:
                  theme.palette.mode === "light"
                    ? "#000"
                    : theme.palette.text.primary,
              }}
              endIcon={<Phone />}
            >
              Phone
            </Button>
          </Stack>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Button
              sx={{
                color:
                  theme.palette.mode === "light"
                    ? "#000"
                    : theme.palette.text.primary,
              }}
              endIcon={<VideoCamera />}
            >
              Video
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={0.5}>
          <Typography variant={"article"}>About</Typography>
          <Typography variant={"body2"}>Imagination is only limit</Typography>
        </Stack>
        <Divider />
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="subtitle2">Media, Link & Docs</Typography>
          <Button
            onClick={() => {
              dispatch(updateSidebar({ type: "SHARED" }));
            }}
            endIcon={<CaretRight />}
          >
            401
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} alignItems={"center"}>
          {[1, 2, 3].map((el, i) => (
            <Box key={i} width={"60px"} height={"60px"}>
              <img
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectfit: "cover",
                }}
                src={faker.image.urlLoremFlickr({ category: "food" })}
                elt={faker.person.fullName()}
              />
            </Box>
          ))}
        </Stack>
        <Divider />
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Star size={21} />
            <Typography variant="subtitle2">Starred Messages</Typography>
          </Stack>
          <IconButton
            onClick={() => {
              console.log("update side bar");

              dispatch(updateSidebar({ type: "STARRED" }));
            }}
          >
            <CaretRight />
          </IconButton>
        </Stack>
        <Divider />
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Bell size={21} />
            <Typography variant="subtitle2">Mute Notification</Typography>
          </Stack>
          <AntSwitch />
        </Stack>
        <Divider />
        <Typography>1 group in common</Typography>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Avatar src={faker.image.avatar()} alt={faker.person.fullName()} />
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">Coding Mink</Typography>
            <Typography variant="subtitle2">Own, Paul, Type</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Button
            onClick={(e) => handleClickOpen("block")}
            startIcon={<Prohibit />}
            fullWidth
            variant="outlined"
          >
            Block
          </Button>
          <Button
            onClick={(e) => handleClickOpen("delete")}
            startIcon={<Trash />}
            fullWidth
            variant="outlined"
          >
            Delete
          </Button>

          <ActionDialog
            open={openBlock}
            handleClose={() => handleClose("block")}
            type={"block"}
          />
          <ActionDialog
            open={openDelete}
            handleClose={() => handleClose("delete")}
            type={"delete"}
          />
        </Stack>
      </Stack>
    </Stack>
    // </Box>
  );
};

export default Contact;
