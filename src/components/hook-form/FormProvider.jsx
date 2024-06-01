import React from "react";
import { FormProvider as Form } from "react-hook-form";
import { FormHelperText, Paper } from "@mui/material";

const FormProvider = ({ children, onSubmit, methods }) => {
  return (
    <Form {...methods}>
      <Paper component={"form"} onSubmit={onSubmit}>
        {children}
      </Paper>
    </Form>
  );
};

export default FormProvider;
