import { useForm } from "vee-validate";
import { useCreateUserMutation } from "./create-user.mutation";
import { CreateUserFormSchema } from "./create-user.schema";
import type { CreateUserFormValues } from "./create-user.schema";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";

export function useCreateUser() {
  const mutation = useCreateUserMutation();
  const { pushTo } = useAppRouter();

  const form = useForm<CreateUserFormValues>({
    validationSchema: toTypeBoxResolver(CreateUserFormSchema),
    initialValues: { email: "", firstName: "", lastName: "", password: "" },
  });

  const [email, emailAttrs] = form.defineField("email");
  const [firstName, firstNameAttrs] = form.defineField("firstName");
  const [lastName, lastNameAttrs] = form.defineField("lastName");
  const [password, passwordAttrs] = form.defineField("password");

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(
      mutation.mutateAsync,
      { body: values },
      {
        success: "User created",
        error: "Failed to create user",
      },
    );
    if (ok) await pushTo.users.list();
  });

  return {
    email,
    emailAttrs,
    firstName,
    firstNameAttrs,
    lastName,
    lastNameAttrs,
    password,
    passwordAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
