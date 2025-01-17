import { z } from "zod";

/**
 * Centralized error handler middleware.
 * It catches three types of errors and returns corresponding error responses:
 *  - `SyntaxError`: Invalid JSON format in the request body.
 *  - Other errors: Internal Server Error with the error message.
 **/
export const errorHandler = (error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      msg: "Invalid JSON format, please check your request body",
    });
  }

  if (error instanceof z.ZodError) {
    return formatZodError(res, error);
  }

  return res.status(500).json({
    msg: "Internal Server Error",
    success: false,
    error: error?.message || "Unknown error occurred",
  });
};
