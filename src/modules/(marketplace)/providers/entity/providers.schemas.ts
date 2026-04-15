import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { RequiredStringSchema } from "#src/common/validation";

export const ProviderFormSchema = Type.Object({
  name: RequiredStringSchema(2),
  description: Type.Optional(Type.String()),
  logoUrl: Type.Optional(Type.String()),
});

export type ProviderFormValues = Static<typeof ProviderFormSchema>;
