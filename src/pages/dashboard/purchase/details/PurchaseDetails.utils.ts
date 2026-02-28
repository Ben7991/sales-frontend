import * as yup from "yup";

export const salesDetailsSchema = yup.object({
  retailUnitPrice: yup
    .string()
    .required("Retail unit price is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid amount")
    .test({
      test: (value) => value !== "0",
      message: "Invalid retail unit price",
    })
    .trim(),
  totalPieces: yup
    .string()
    .required("Packs / Total pieces is required")
    .matches(/^[0-9]+$/, "Only numbers")
    .test({
      test: (value) => value !== "0",
      message: "Invalid total pieces",
    })
    .trim(),
  numberOfBoxes: yup
    .string()
    .required("Packs / Total pieces is required")
    .matches(/^[0-9]+$/, "Only numbers")
    .test({
      test: (value) => value !== "0",
      message: "Invalid number of boxes",
    })
    .trim(),
});

export const wholesalePriceSchema = yup.object({
  price: yup
    .string()
    .required("Required")
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid amount")
    .test({
      test: (value) => value !== "0",
      message: "Invalid amount",
    })
    .trim(),
  quantity: yup
    .string()
    .required("Required")
    .matches(/^[0-9]+$/, "Only numbers")
    .test({
      test: (value) => value !== "0",
      message: "Invalid quantity",
    })
    .trim(),
});

export const miscPriceSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z ]*$/, "Only letters are allowed")
    .trim(),
  amount: yup
    .string()
    .required("Required")
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid amount")
    .test({
      test: (value) => value !== "0",
      message: "Invalid amount",
    })
    .trim(),
});
