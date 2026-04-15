import type { PostV1AuthSignInResponse } from "#src/common/api/sdk";

export type Credentials = PostV1AuthSignInResponse;

export type User = Credentials["user"];
