import { useMutation } from "@tanstack/vue-query";
import { postV1AuthResetPasswordMutation } from "#src/common/api/sdk-queries";

export const useResetPasswordMutation = () => useMutation(postV1AuthResetPasswordMutation());
