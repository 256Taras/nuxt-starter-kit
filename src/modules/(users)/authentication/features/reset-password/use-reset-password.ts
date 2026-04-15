import { useForm } from "vee-validate";
import { useResetPasswordMutation } from "./reset-password.mutation";
import { ResetPasswordPageSchema } from "./reset-password.schema";
import type { ResetPasswordPageValues } from "./reset-password.schema";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";

export function useResetPassword(token: () => string) {
  const mutation = useResetPasswordMutation();
  const { pushTo } = useAppRouter();

  const form = useForm<ResetPasswordPageValues>({
    validationSchema: toTypeBoxResolver(ResetPasswordPageSchema),
    initialValues: { password: "" },
  });

  const [password, passwordAttrs] = form.defineField("password");

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { body: { password: values.password, token: token() } },
      { success: "Password reset successfully", error: "Reset failed" },
    );
    if (ok) await pushTo.auth.signIn();
  });

  return {
    password,
    passwordAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
