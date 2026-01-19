import { StatusCodes } from "./types.utils";

export const FAILED_STATUS_CODES: Array<number> = [
  StatusCodes.BAD_REQUEST,
  StatusCodes.VALIDATION_FAILED,
  StatusCodes.SERVER_ERROR,
  StatusCodes.FORBIDDEN,
];
