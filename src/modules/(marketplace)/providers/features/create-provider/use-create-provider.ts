import { useForm } from "vee-validate";
import { useCreateProviderMutation } from "./create-provider.mutation";
import { ProviderFormSchema } from "../../entity";
import type { ProviderFormValues } from "../../entity";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";
import { useAppRouter } from "#src/common/routing/app-router";

export function useCreateProvider() {
  const mutation = useCreateProviderMutation();
  const { pushTo } = useAppRouter();

  const form = useForm<ProviderFormValues>({
    validationSchema: toTypeBoxResolver(ProviderFormSchema),
    initialValues: { name: "", description: "", logoUrl: "" },
  });

  const [name, nameAttrs] = form.defineField("name");
  const [description, descriptionAttrs] = form.defineField("description");
  const [logoUrl, logoUrlAttrs] = form.defineField("logoUrl");

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { body: { name: values.name, ...stripEmpty({ description: values.description, logoUrl: values.logoUrl }) } },
      { success: "Provider created", error: "Failed to create provider" },
    );
    if (ok) await pushTo.providers.list();
  });

  return {
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
