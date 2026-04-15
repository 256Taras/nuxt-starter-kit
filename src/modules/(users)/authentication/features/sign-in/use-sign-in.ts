import { useForm } from "vee-validate";
import { useSignInMutation } from "./sign-in.mutation";
import { SignInFormSchema } from "./sign-in.schema";
import type { SignInFormValues } from "./sign-in.schema";
import { useAuthenticationStore } from "../../entity";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { useAppRouter } from "#src/common/routing/app-router";

export function useSignIn() {
  const mutation = useSignInMutation();
  const authStore = useAuthenticationStore();
  const { pushTo } = useAppRouter();

  const form = useForm<SignInFormValues>({
    validationSchema: toTypeBoxResolver(SignInFormSchema),
    initialValues: { email: "", password: "" },
  });

  const [email, emailAttrs] = form.defineField("email");
  const [password, passwordAttrs] = form.defineField("password");

  async function signInAndStore(values: SignInFormValues) {
    const credentials = await mutation.mutateAsync({ body: values });
    authStore.setCredentials(credentials);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await runWithToast(signInAndStore, values, {
      success: "Signed in successfully",
      error: "Sign in failed",
    });
    if (ok) await pushTo.home();
  });

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors: form.errors,
    meta: form.meta,
    isPending: mutation.isPending,
    onSubmit,
  };
}
