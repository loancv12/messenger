import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import React, { useEffect } from "react";
import CreateGroupForm from "./CreateGroupForm";
import { useDispatch } from "react-redux";
import { fetchFriends } from "../../redux/relationShip/relationShipApi";
import useLocales from "../../hooks/useLocales";
import toCamelCase from "../../utils/toCamelCase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CreateGroup = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { translate } = useLocales();
  useEffect(() => {
    dispatch(fetchFriends());
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
