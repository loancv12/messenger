import PropTypes from "prop-types";

// Form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Autocomplete, Box, TextField } from "@mui/material";
import { faker } from "@faker-js/faker";
RHFAutoComplete.prototype = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFAutoComplete({ name, label, helperText, ...other }) {
  const { control, setValue } = useFormContext();
  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          fullWidth
          value={
            typeof field.value === "number" && field.value === 0
              ? ""
              : field.value
          }
          onChange={(e, newValue) => {
            setValue(name, newValue, { shouldValidate: true });
          }}
          {...other}
          getOptionLabel={(option) => {
            return `${option?.firstName} ${option?.lastName}`;
          }}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading="lazy"
                width="20"
                src={`${faker.image.avatar()}
                `}
                alt=""
              />
              {`${option?.firstName} ${option?.lastName}`}
            </Box>
          )}
          renderInput={(params) => {
            return (
              <TextField
                helperText={error ? error.message : helperText}
                label={label}
                error={!!error}
                {...params}
              />
            );
          }}
        />
      )}
      name={name}
      control={control}
    ></Controller>
  );
}
