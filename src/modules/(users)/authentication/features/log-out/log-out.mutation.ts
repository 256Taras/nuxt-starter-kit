import { useMutation } from "@tanstack/vue-query";
import { postV1AuthLogOutMutation } from "#src/common/api/sdk-queries";

export const useLogOutMutation = () => useMutation(postV1AuthLogOutMutation());
