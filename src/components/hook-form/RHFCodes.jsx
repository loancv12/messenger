import { Stack, TextField } from "@mui/material";
import React, { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

const RHFCodes = ({ keyName = "", otpLength = 1, ...other }) => {
  const codesRef = useRef(null);
  const { control, setValue } = useFormContext();

  const handleChangeWithNextField = (e, handleChange) => {
    // debugger;
    console.log(e.target.value);
    const { maxLength, value, name } = e.target;
    const fieldIndex = name.replace(keyName, "");

    const filedInIndex = Number(fieldIndex);

    const nextField = document.querySelector(
      `input[name=${keyName}${filedInIndex + 1}]`
    );

    if (value.length > maxLength) {
      e.target.value = value[0];
    }
    if (value.length >= maxLength && filedInIndex < 6 && nextField) {
      nextField.focus();
    }

    handleChange(e);
  };

  return (
    <Stack
      direction={"row"}
      spacing={2}
      ref={codesRef}
      justifyContent={"center"}
    >
      {[...Array(otpLength).keys()].map((name, i) => {
        return (
          <Controller
            key={i}
            name={`${keyName}${i + 1}`}
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  {...field}
                  onChange={(e) => {
                    handleChangeWithNextField(e, field.onChange);
                  }}
                  autoFocus={i === 0}
                  placeholder="-"
                  error={!!error}
                  inputProps={{
                    style: {
                      textAlign: "center",
                      width: {
                        xs: 36,
                        sm: 56,
                      },
                      height: {
                        xs: 36,
                        sm: 56,
                      },
                    },
                    maxLength: 1,
                    type: "number",
                  }}
                  helperText={error ? error.message : ""}
                  {...other}
                />
              );
            }}
          />
        );
      })}
    </Stack>
  );
};

export default RHFCodes;
