import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validate = (schema: ZodSchema<any>, type: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data =
      type === "body"
        ? req.body
        : type === "query"
        ? req.query
        : req.params; // Now supports "params"

    const result = schema.safeParse(data);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed from validator",
        errors: result.error.errors.map((err) => err.message),
      });
      return;
    }

    next();
  };
};

export default validate;
