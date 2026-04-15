import type {
  GetV1ProvidersByIdResponse,
  GetV1ProvidersResponse,
  PostV1ProvidersData,
  PatchV1ProvidersByIdData,
} from "#src/common/api/sdk";

export type Provider = GetV1ProvidersByIdResponse;

export type ProviderListResponse = GetV1ProvidersResponse;

export type ProviderListItem = Required<ProviderListResponse["data"][number]>;

export type ProviderCreateInput = PostV1ProvidersData["body"];

export type ProviderUpdateInput = NonNullable<PatchV1ProvidersByIdData["body"]>;
