import { useForm } from "vee-validate";
import type { TObject, TProperties, Static } from "@sinclair/typebox";
import { toTypeBoxResolver } from "./typebox-resolver";

/**
 * Thin wrapper over `useForm` for TypeBox-backed forms.
 *
 * Before:
 *   const { handleSubmit, errors, defineField, meta } = useForm<Values>({
 *     validationSchema: toTypeBoxResolver(Schema),
 *     initialValues,
 *   });
 *   const [email, emailAttrs] = defineField("email");
 *   const [password, passwordAttrs] = defineField("password");
 *
 * After:
 *   const form = useTypeBoxForm(Schema, initialValues);
 *   const [email, emailAttrs] = form.defineField("email");
 *   // ...or the full useForm API via spread
 */
export function useTypeBoxForm<S extends TObject<TProperties>>(schema: S, initialValues: Static<S>) {
  return useForm<Static<S>>({
    validationSchema: toTypeBoxResolver(schema),
    // vee-validate types initialValues as PartialDeep<Values>; full object is safe.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialValues: initialValues as any,
  });
}
