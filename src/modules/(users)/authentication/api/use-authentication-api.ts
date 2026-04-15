import type {
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  Credentials,
} from "../types/authentication.types";
import type { components } from "#src/common/api/generated/api-schema";
import { useHttpClient } from "#src/common/api/use-http-client";

type StatusResponse = components["schemas"]["StatusResponse"];
type ForgotPasswordOutput = components["schemas"]["ForgotPasswordOutput"];

export function useAuthenticationApi() {
  const http = useHttpClient();

  return {
    signUp: (body: SignUpInput) => http.post<Credentials>("/v1/auth/sign-up", body),

    signIn: (body: SignInInput) => http.post<Credentials>("/v1/auth/sign-in", body),

    logOut: () => http.post<StatusResponse>("/v1/auth/log-out"),

    refreshTokens: () => http.put<Credentials>("/v1/auth/refresh-tokens"),

    forgotPassword: (body: ForgotPasswordInput) => http.post<ForgotPasswordOutput>("/v1/auth/forgot-password", body),

    resetPassword: (body: ResetPasswordInput) => http.post<StatusResponse>("/v1/auth/reset-password", body),

    changePassword: (body: ChangePasswordInput) => http.post<StatusResponse>("/v1/auth/change-password", body),
  };
}
