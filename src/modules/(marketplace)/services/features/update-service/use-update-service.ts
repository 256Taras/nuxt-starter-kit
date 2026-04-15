import { watch } from "vue";
import type { Ref } from "vue";
import { useForm } from "vee-validate";
import { useUpdateServiceMutation } from "./update-service.mutation";
import { useServiceDetailQuery, ServiceFormSchema } from "../../entity";
import type { ServiceFormValues } from "../../entity";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

export function useUpdateService(serviceId: Ref<UUID>) {
  const mutation = useUpdateServiceMutation();
  const { pushTo } = useAppRouter();
  const { data: service, isLoading, isError, error } = useServiceDetailQuery(serviceId);

  const form = useForm<ServiceFormValues>({
    validationSchema: toTypeBoxResolver(ServiceFormSchema),
    initialValues: { name: "", description: "", imageUrl: "", price: 0, duration: 60 },
  });

  const [name, nameAttrs] = form.defineField("name");
  const [description, descriptionAttrs] = form.defineField("description");
  const [imageUrl, imageUrlAttrs] = form.defineField("imageUrl");
  const [price, priceAttrs] = form.defineField("price");
  const [duration, durationAttrs] = form.defineField("duration");

  watch(
    service,
    (s) => {
      if (s) {
        form.setValues({
          name: s.name,
          description: typeof s.description === "string" ? s.description : "",
          imageUrl: typeof s.imageUrl === "string" ? s.imageUrl : "",
          price: s.price,
          duration: s.duration,
        });
      }
    },
    { immediate: true },
  );

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { id: serviceId.value, values },
      { success: "Service updated", error: "Failed to update service" },
    );
    if (ok) await pushTo.services.view({ id: serviceId.value });
  });

  return {
    service,
    isLoading,
    isError,
    error,
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
