import { useMutation } from "@tanstack/vue-query";
import { postV1AuthSignInMutation } from "#src/common/api/sdk-queries";

export const useSignInMutation = () => useMutation(postV1AuthSignInMutation());
