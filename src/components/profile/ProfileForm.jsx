import React, { useCallback, useEffect, useState } from "react";
import FormProvider from "../hook-form/FormProvider";
import * as Yup from "yup";
import { object, string, number, date } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Avatar,
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { RHFTextField } from "../hook-form";
import { Camera, Eye, EyeSlash, UploadSimple } from "phosphor-react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrUser } from "../../redux/relationShip/relationShipSlice";
import { VisuallyHiddenInput } from "../common/VisuallyHiddenInput";
import { filterValidFiles } from "../../utils/checkValidFile";
import { imageFileTypesWithMIME, maxSize } from "../../config";
import RHFFileUpload from "../hook-form/RHFFileUpload";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { updateProfile } from "../../redux/relationShip/relationShipApi";

const ProfileForm = () => {
  const currUser = useSelector(selectCurrUser);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { callAction, isLoading, isError } = useAxiosPrivate();

  const schema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    avatar: Yup.mixed().test(
      "is-valid-file",
      "File is invalid type",
      (file, ctx) => {
        if (file instanceof File) {
          const allowFileTypes = imageFileTypesWithMIME.filter(
            (format) => !format.notWideSp
          );

          const validFiles = filterValidFiles(
            [file],
            allowFileTypes,
            1,
            maxSize
          );
          return validFiles.length;
        } else if (file === "") {
          return true;
        }
        return false;
      }
    ),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    avatar: {},
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Submit data
      console.log(data);
      const formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      await callAction(updateProfile(formData));
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    setValue("avatar", file);
    setFile(file);
  };

  useEffect(() => {
    reset({ ...currUser, avatar: "" });
  }, [currUser]);

  useEffect(() => {
    let imgUrl;
    if (file) {
      imgUrl = URL.createObjectURL(file);
      setPreview(imgUrl);
    }

    return () => {
      URL.revokeObjectURL(imgUrl);
    };
  }, [file]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} p={4}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && errors.afterSubmit.message && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}
          <Stack
            spacing={4}
            direction={{ xs: "column", md: "row" }}
            alignItems={"center"}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={preview ?? "/images/default-avatar/jpg"}
                alt={currUser.firstName}
                sx={{
                  width: { xs: "56px", md: "100px" },
                  height: { xs: "56px", md: "100px" },
                }}
              />
              <Tooltip title="Change avatar">
                <IconButton
                  component="label"
                  htmlFor="change-avatar-input"
                  aria-label="change avatar"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: { xs: "56px", md: "100px" },
                    height: { xs: "56px", md: "100px" },
                    backgroundColor: "rgba(0,0,0,.2)",
                  }}
                >
                  <Camera sx={56} weight="fill" />
                </IconButton>
              </Tooltip>

              <RHFFileUpload
                id="change-avatar-input"
                name="avatar"
                defaultLink="/images/default-avatar/jpg"
                alt={currUser.firstName}
                onChange={handleChangeAvatar}
              />
            </Box>

            <Stack spacing={2} sx={{ width: "100%" }}>
              <RHFTextField
                name="firstName"
                label="First name"
                helperText={"This first name is visible to your contacts"}
              />
              <RHFTextField
                name="lastName"
                label="Last name"
                helperText={"This last name is visible to your contacts"}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction={"row"} justifyContent={"end"}>
          <Button color="primary" size="large" type="submit" variant="outlined">
            Save
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
