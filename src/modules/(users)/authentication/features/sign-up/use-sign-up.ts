import { useForm } from "vee-validate";
import { useSignUpMutation } from "./sign-up.mutation";
import { SignUpFormSchema } from "./sign-up.schema";
import type { SignUpFormValues } from "./sign-up.schema";
import { useAuthenticationStore } from "../../entity";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";

export function useSignUp() {
  const mutation = useSignUpMutation();
  const authStore = useAuthenticationStore();
  const { pushTo } = useAppRouter();

  const form = useForm<SignUpFormValues>({
    validationSchema: toTypeBoxResolver(SignUpFormSchema),
    initialValues: { email: "", firstName: "", lastName: "", password: "" },
  });

  const [email, emailAttrs] = form.defineField("email");
  const [firstName, firstNameAttrs] = form.defineField("firstName");
  const [lastName, lastNameAttrs] = form.defineField("lastName");
  const [password, passwordAttrs] = form.defineField("password");

  async function signUpAndStore(values: SignUpFormValues) {
    const credentials = await mutation.mutateAsync({ body: values });
    authStore.setCredentials(credentials);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(signUpAndStore, values, {
      success: "Account created successfully",
      error: "Sign up failed",
    });
    if (ok) await pushTo.home();
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
