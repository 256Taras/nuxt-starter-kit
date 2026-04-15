import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";

// datetime-local produces "YYYY-MM-DDTHH:mm" — at least 16 chars
export const CreateBookingFormSchema = Type.Object({
  startAt: Type.String({ minLength: 16, pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}" }),
});

export type CreateBookingFormValues = Static<typeof CreateBookingFormSchema>;
