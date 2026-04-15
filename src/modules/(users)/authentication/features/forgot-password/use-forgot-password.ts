import { ref } from "vue";
import { useForm } from "vee-validate";
import { useForgotPasswordMutation } from "./forgot-password.mutation";
import { ForgotPasswordFormSchema } from "./forgot-password.schema";
import type { ForgotPasswordFormValues } from "./forgot-password.schema";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";

export function useForgotPassword() {
  const mutation = useForgotPasswordMutation();
  const submitted = ref(false);

  const form = useForm<ForgotPasswordFormValues>({
    validationSchema: toTypeBoxResolver(ForgotPasswordFormSchema),
    initialValues: { email: "" },
  });

  const [email, emailAttrs] = form.defineField("email");

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { body: values },
      {
        success: "Reset instructions sent",
        error: "Request failed",
      },
    );
    if (ok) submitted.value = true;
  });

  return {
    email,
    emailAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    submitted,
    onSubmit,
  };
}
