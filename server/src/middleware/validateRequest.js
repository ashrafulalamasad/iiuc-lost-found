import { z } from "zod";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { success, error, data } = schema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        data: z.flattenError(error).fieldErrors,
      });
    }
    req.validatedData = data;
    next();
  };
};
