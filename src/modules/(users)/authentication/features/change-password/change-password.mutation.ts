import { useMutation } from "@tanstack/vue-query";
import { postV1AuthChangePasswordMutation } from "#src/common/api/sdk-queries";

export const useChangePasswordMutation = () => useMutation(postV1AuthChangePasswordMutation());
