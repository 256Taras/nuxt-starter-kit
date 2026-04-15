import { watch } from "vue";
import { useForm } from "vee-validate";
import { useUpdateProviderMutation } from "./update-provider.mutation";
import { useProviderDetailQuery, ProviderFormSchema } from "../../entity";
import type { ProviderFormValues } from "../../entity";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { Ref } from "vue";
import type { UUID } from "#src/types";

export function useUpdateProvider(providerId: Ref<UUID>) {
  const mutation = useUpdateProviderMutation();
  const { pushTo } = useAppRouter();
  const { data: provider, isLoading, isError, error } = useProviderDetailQuery(providerId);

  const form = useForm<ProviderFormValues>({
    validationSchema: toTypeBoxResolver(ProviderFormSchema),
    initialValues: { name: "", description: "", logoUrl: "" },
  });

  const [name, nameAttrs] = form.defineField("name");
  const [description, descriptionAttrs] = form.defineField("description");
  const [logoUrl, logoUrlAttrs] = form.defineField("logoUrl");

  watch(
    provider,
    (p) => {
      if (p) {
        form.setValues({
          name: p.name,
          description: typeof p.description === "string" ? p.description : "",
          logoUrl: typeof p.logoUrl === "string" ? p.logoUrl : "",
        });
      }
    },
    { immediate: true },
  );

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { id: providerId.value, values },
      { success: "Provider updated", error: "Failed to update provider" },
    );
    if (ok) await pushTo.providers.view({ id: providerId.value });
  });

  return {
    provider,
    isLoading,
    isError,
    error,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    logoUrl,
    logoUrlAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
