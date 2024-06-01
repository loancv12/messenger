import * as Yup from "yup";
import { object, string, number, date } from "yup";

const NewPwdSchema = Yup.object({
  newPwd: Yup.string()
    .min(6, "Password must be at least 6 character")
    .required("Password is required"),
  confirmPwd: string()
    .required("Password is required")
    .oneOf([Yup.ref("newPwd"), null], "Pass musy match"),
});

export default NewPwdSchema;
