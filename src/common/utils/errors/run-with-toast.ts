import { toast } from "vue3-toastify";
import { formatApiError } from "./format-api-error";

export async function runWithToast<V>(
  mutate: (vars: V) => Promise<unknown>,
  vars: V,
  messages: { success: string; error: string },
): Promise<boolean> {
  try {
    await mutate(vars);
    toast.success(messages.success);
    return true;
  } catch (err) {
    toast.error(formatApiError(err, messages.error));
    return false;
  }
}
