import { useForm } from "vee-validate";
import { useCreateBookingMutation } from "./create-booking.mutation";
import { CreateBookingFormSchema } from "./create-booking.schema";
import type { CreateBookingFormValues } from "./create-booking.schema";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

export function useCreateBooking(serviceId: () => UUID) {
  const mutation = useCreateBookingMutation();
  const { pushTo } = useAppRouter();

  const form = useForm<CreateBookingFormValues>({
    validationSchema: toTypeBoxResolver(CreateBookingFormSchema),
    initialValues: { startAt: "" },
  });

  const [startAt, startAtAttrs] = form.defineField("startAt");

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { body: { serviceId: serviceId(), startAt: new Date(values.startAt).toISOString() } },
      { success: "Booking created", error: "Failed to create booking" },
    );
    if (ok) await pushTo.bookings.list();
  });

  return {
    startAt,
    startAtAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
