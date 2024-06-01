import * as Yup from "yup";
import { object, string, number, date } from "yup";

const NewGroupSchema = Yup.object().shape({
  name: Yup.string().required("Group name is required"),
  members: Yup.array().min(2, "Must have at least 2 members"),
});

export default NewGroupSchema;
