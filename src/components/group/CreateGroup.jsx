import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { useEffect, useRef } from "react";
import CreateGroupForm from "./CreateGroupForm";
import { useDispatch } from "react-redux";
import { fetchFriends } from "../../redux/relationShip/relationShipApi";
import useLocales from "../../hooks/useLocales";
import toCamelCase from "../../utils/toCamelCase";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingScreen from "../common/LoadingScreen";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CreateGroup = ({ open, handleClose }) => {
  const isFirstMount = useRef(true);

  const { translate } = useLocales();
  const { callAction, isLoading, isError } = useAxiosPrivate();

  useEffect(() => {
    const fetchFr = async () => {
      await callAction(fetchFriends());
    };
    if (!isFirstMount.current || process.env.NODE_ENV !== "development") {
      fetchFr();
    }

    return () => {
      isFirstMount.current = false;
    };
  }, []);

  let content;
  if (isLoading) {
    content = <LoadingScreen />;
  } else if (isError) {
    content = <TypeError>Something wrong</TypeError>;
  } else {
    content = <CreateGroupForm handleClose={handleClose} />;
  }
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle>
        {translate(`groupCvs.${toCamelCase("Create New Group")}`)}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
