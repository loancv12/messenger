import PropTypes from "prop-types";

// Form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";
RHFTextField.prototype = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFTextField({ name, helperText, ...other }) {
  const { control } = useFormContext();
  return (
    <Controller
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            fullWidth
            value={
              typeof field.value === "number" && field.value === 0
                ? ""
                : field.value
            }
            error={!!error}
            helperText={error ? error.message : helperText}
            {...other}
          />
        );
      }}
      name={name}
      control={control}
    ></Controller>
  );
}
