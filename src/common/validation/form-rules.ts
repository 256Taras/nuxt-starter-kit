import { Type } from "@sinclair/typebox";

export const EmailSchema = Type.String({ format: "email", minLength: 1 });

export const PasswordSchema = Type.String({
  minLength: 6,
  pattern: String.raw`^(?=.*[A-Za-z])(?=.*\d).+$`,
});

export const RequiredStringSchema = (minLength = 1) => Type.String({ minLength });
