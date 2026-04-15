import { watch } from "vue";
import type { Ref } from "vue";
import { useForm } from "vee-validate";
import { useUpdateUserMutation } from "./update-user.mutation";
import { EditUserFormSchema } from "./update-user.schema";
import type { EditUserFormValues } from "./update-user.schema";
import { useUserDetailQuery } from "../../entity";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";
import type { UUID } from "#src/types";

export function useUpdateUser(userId: Ref<UUID>) {
  const mutation = useUpdateUserMutation();
  const { pushTo } = useAppRouter();
  const { data: user, isLoading, isError, error } = useUserDetailQuery(userId);

  const form = useForm<EditUserFormValues>({
    validationSchema: toTypeBoxResolver(EditUserFormSchema),
    initialValues: { firstName: "", lastName: "" },
  });

  const [firstName, firstNameAttrs] = form.defineField("firstName");
  const [lastName, lastNameAttrs] = form.defineField("lastName");

  watch(
    user,
    (u) => {
      if (u) form.setValues({ firstName: u.firstName, lastName: u.lastName });
    },
    { immediate: true },
  );

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { path: { id: userId.value }, body: values },
      { success: "User updated", error: "Failed to update user" },
    );
    if (ok) await pushTo.users.view({ id: userId.value });
  });

  return {
    user,
    isLoading,
    isError,
    error,
    firstName,
    firstNameAttrs,
    lastName,
    lastNameAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
