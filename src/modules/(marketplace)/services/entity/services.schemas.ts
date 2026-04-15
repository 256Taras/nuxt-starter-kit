import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { RequiredStringSchema } from "#src/common/validation";

export const ServiceFormSchema = Type.Object({
  name: RequiredStringSchema(2),
  description: Type.Optional(Type.String()),
  imageUrl: Type.Optional(Type.String()),
  price: Type.Number({ minimum: 0.01 }),
  duration: Type.Number({ minimum: 1 }),
});

export type ServiceFormValues = Static<typeof ServiceFormSchema>;
