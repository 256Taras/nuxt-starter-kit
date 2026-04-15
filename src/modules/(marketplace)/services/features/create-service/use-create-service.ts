import { useForm } from "vee-validate";
import { useCreateServiceMutation } from "./create-service.mutation";
import { ServiceFormSchema } from "../../entity";
import type { ServiceFormValues } from "../../entity";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

export function useCreateService(providerId: () => UUID) {
  const mutation = useCreateServiceMutation();
  const { pushTo } = useAppRouter();

  const form = useForm<ServiceFormValues>({
    validationSchema: toTypeBoxResolver(ServiceFormSchema),
    initialValues: { name: "", description: "", imageUrl: "", price: 0, duration: 60 },
  });

  const [name, nameAttrs] = form.defineField("name");
  const [description, descriptionAttrs] = form.defineField("description");
  const [imageUrl, imageUrlAttrs] = form.defineField("imageUrl");
  const [price, priceAttrs] = form.defineField("price");
  const [duration, durationAttrs] = form.defineField("duration");

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { providerId: providerId(), values },
      { success: "Service created", error: "Failed to create service" },
    );
    if (ok) await pushTo.services.list();
  });

  return {
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    imageUrl,
    imageUrlAttrs,
    price,
    priceAttrs,
    duration,
    durationAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
