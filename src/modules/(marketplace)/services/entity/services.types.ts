import type {
  GetV1ServicesByIdResponse,
  GetV1ServicesResponse,
  PostV1ServicesProviderByProviderIdData,
  PatchV1ServicesByIdData,
} from "#src/common/api/sdk";

export type Service = GetV1ServicesByIdResponse;

export type ServiceListResponse = GetV1ServicesResponse;

export type ServiceListItem = Required<ServiceListResponse["data"][number]>;

export type ServiceCreateInput = PostV1ServicesProviderByProviderIdData["body"];

export type ServiceUpdateInput = NonNullable<PatchV1ServicesByIdData["body"]>;

export const ServiceStatus = {
  Active: "active",
  Inactive: "inactive",
  Draft: "draft",
} as const;

export type ServiceStatus = (typeof ServiceStatus)[keyof typeof ServiceStatus];
