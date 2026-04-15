import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { EmailSchema, PasswordSchema, RequiredStringSchema } from "#src/common/validation";

export const SignUpFormSchema = Type.Object({
  email: EmailSchema,
  firstName: RequiredStringSchema(2),
  lastName: RequiredStringSchema(2),
  password: PasswordSchema,
});

export const SignInFormSchema = Type.Object({
  email: EmailSchema,
  password: Type.String({ minLength: 1 }),
});

export const ForgotPasswordFormSchema = Type.Object({
  email: EmailSchema,
});

export const ResetPasswordFormSchema = Type.Object({
  password: PasswordSchema,
  token: Type.String({ minLength: 1 }),
});

export const ChangePasswordFormSchema = Type.Object({
  oldPassword: Type.String({ minLength: 1 }),
  newPassword: PasswordSchema,
});

export type SignUpFormValues = Static<typeof SignUpFormSchema>;
export type SignInFormValues = Static<typeof SignInFormSchema>;
export type ForgotPasswordFormValues = Static<typeof ForgotPasswordFormSchema>;
export type ResetPasswordFormValues = Static<typeof ResetPasswordFormSchema>;
export type ChangePasswordFormValues = Static<typeof ChangePasswordFormSchema>;
