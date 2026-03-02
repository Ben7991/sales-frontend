import * as yup from "yup";

export const changeThresholdSchema = yup.object({
  minimumThreshold: yup
    .string()
    .required("Minimum threshold is required")
    .matches(/^[0-9]*$/, "Only numbers are allowed")
    .trim(),
});
