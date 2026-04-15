import type {
  PostV1ReviewsBookingByIdResponse,
  GetV1ReviewsServiceByServiceIdResponse,
  PostV1ReviewsBookingByIdData,
} from "#src/common/api/sdk";

export type Review = PostV1ReviewsBookingByIdResponse;

export type ReviewListResponse = GetV1ReviewsServiceByServiceIdResponse;

export type ReviewCreateInput = PostV1ReviewsBookingByIdData["body"];
