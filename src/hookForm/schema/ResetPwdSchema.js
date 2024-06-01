import * as Yup from "yup";
import { object, string, number, date } from "yup";

const ResetPwdSchema = Yup.object().shape({
  email: Yup.string()
    .required("Emal is required")
    .email("Email must be a valid email"),
});

export default ResetPwdSchema;
