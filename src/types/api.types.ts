export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly meta: PaginationMeta;
}

export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
}

export interface ApiErrorResponse {
  readonly statusCode: number;
  readonly message: string;
  readonly error?: string;
}
