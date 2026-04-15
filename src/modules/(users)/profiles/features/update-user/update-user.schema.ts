import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { RequiredStringSchema } from "#src/common/validation";

export const EditUserFormSchema = Type.Object({
  firstName: RequiredStringSchema(2),
  lastName: RequiredStringSchema(2),
});

export type EditUserFormValues = Static<typeof EditUserFormSchema>;
