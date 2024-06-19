import { Alert, Button, Stack } from "@mui/material";
import React, { useContext } from "react";
import FormProvider from "../../components/hook-form/FormProvider";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RHFTextField } from "../../components/hook-form";
import RHFAutoComplete from "../../components/hook-form/RHFAutoComplete";
// import { socket } from "../../socket";
import { useSelector } from "react-redux";
import useLocales from "../../hooks/useLocales";
import { SocketContext } from "../../contexts/SocketProvider";
import { selectFriends } from "../../redux/relationShip/relationShipSlice";
import NewGroupSchema from "../../hookForm/schema/NewGroupSchema";
import useAuth from "../../hooks/useAuth";

const CreateGroupForm = ({ handleClose }) => {
  const friends = useSelector(selectFriends);
  const { userId } = useAuth();

  const socket = useContext(SocketContext);

  const defaultValues = {
    name: "",
    members: [],
  };
  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;
  console.log(errors);

  const onSubmit = async (data) => {
    console.log("create a new group", data);
    socket.emit("create_group_conversation", { ...data, adminId: userId });
    reset();
    handleClose();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        <RHFTextField name="name" label="Name" />
        <RHFAutoComplete
          name="members"
          label="Member"
          multiple
          limitTags={2}
          freeSolo
          chippros={{ size: "medium" }}
          options={friends}
        />
        <Stack
          spacing={2}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default CreateGroupForm;
