import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { useEffect, useRef } from "react";
import CreateGroupForm from "./CreateGroupForm";
import { useDispatch } from "react-redux";
import { fetchFriends } from "../../redux/relationShip/relationShipApi";
import useLocales from "../../hooks/useLocales";
import toCamelCase from "../../utils/toCamelCase";
import useAxios from "../../hooks/useAxios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CreateGroup = ({ open, handleClose }) => {
  const isFirstMount = useRef(true);

  const { translate } = useLocales();
  const { callAction, isLoading, isError } = useAxios("create group");

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
      <DialogContent>
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
