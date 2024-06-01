import * as Yup from "yup";
import { object, string, number, date } from "yup";

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Las Name is required"),
  email: Yup.string()
    .required("Emal is required")
    .email("Email must be a valid email"),
  pwd: string().required("Password is required"),
});

export default RegisterSchema;
