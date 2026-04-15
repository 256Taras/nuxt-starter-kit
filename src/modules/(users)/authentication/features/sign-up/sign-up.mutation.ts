import { useMutation } from "@tanstack/vue-query";
import { postV1AuthSignUpMutation } from "#src/common/api/sdk-queries";

export const useSignUpMutation = () => useMutation(postV1AuthSignUpMutation());
