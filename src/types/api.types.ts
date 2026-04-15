export type UUID = string & { readonly __brand: "UUID" };

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

export interface CursorPaginationMeta {
  readonly itemCount: number;
  readonly limit: number;
  readonly startCursor?: string;
  readonly endCursor?: string;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface CursorPaginatedResponse<T> {
  readonly data: readonly T[];
  readonly meta: CursorPaginationMeta;
}

export interface CursorPaginationParams {
  readonly limit?: number;
  readonly after?: string;
  readonly before?: string;
}

export interface ApiErrorResponse {
  readonly statusCode: number;
  readonly message: string;
  readonly error?: string;
}

/**
 * Shared shape for PUT/PATCH mutation variables: an entity ID plus a
 * body matching the module's `XxxUpdateInput`. Used across providers,
 * services, users and bookings update mutations.
 */
export interface UpdateMutationVars<TBody> {
  readonly id: UUID;
  readonly body: TBody;
}
