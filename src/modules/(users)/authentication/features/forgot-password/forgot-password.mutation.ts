import { useMutation } from "@tanstack/vue-query";
import { postV1AuthForgotPasswordMutation } from "#src/common/api/sdk-queries";

export const useForgotPasswordMutation = () => useMutation(postV1AuthForgotPasswordMutation());
