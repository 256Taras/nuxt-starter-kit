import { useForm } from "vee-validate";
import { useChangePasswordMutation } from "./change-password.mutation";
import { ChangePasswordFormSchema } from "./change-password.schema";
import type { ChangePasswordFormValues } from "./change-password.schema";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";

export function useChangePassword() {
  const mutation = useChangePasswordMutation();
  const { pushTo } = useAppRouter();

  const form = useForm<ChangePasswordFormValues>({
    validationSchema: toTypeBoxResolver(ChangePasswordFormSchema),
    initialValues: { oldPassword: "", newPassword: "" },
  });

  const [oldPassword, oldPasswordAttrs] = form.defineField("oldPassword");
  const [newPassword, newPasswordAttrs] = form.defineField("newPassword");

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { body: values },
      {
        success: "Password changed successfully",
        error: "Failed to change password",
      },
    );
    if (ok) await pushTo.profile();
  });

  return {
    oldPassword,
    oldPasswordAttrs,
    newPassword,
    newPasswordAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
