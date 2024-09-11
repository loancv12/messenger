import PropTypes from "prop-types";

// Form
import { useFormContext, Controller } from "react-hook-form";
import { VisuallyHiddenInput } from "../common/VisuallyHiddenInput";
import { FormHelperText, Typography } from "@mui/material";
// @mui

export default function RHFFileUpload({
  name,
  defaultLink,
  alt,
  onChange,
  ...other
}) {
  const { control } = useFormContext();
  return (
    <Controller
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <VisuallyHiddenInput
              type="file"
              name={name}
              src={
                !field.value
                  ? defaultLink
                  : field.value instanceof File
                  ? URL.createObjectURL(field.value)
                  : field.value
              }
              alt={alt}
              onChange={onChange}
              {...other}
            />
            <FormHelperText error={!!error} focused={!!error}>
              {error?.message}
            </FormHelperText>
          </>
        );
      }}
      name={name}
      control={control}
    ></Controller>
  );
}
