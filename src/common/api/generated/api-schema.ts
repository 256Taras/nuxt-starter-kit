/**
 * Auto-generated OpenAPI types for the backend API.
 * Source: node-starter-kit Fastify backend
 *
 * Regenerate by reading the backend contracts and updating this file.
 */

export interface paths {
  "/v1/auth/sign-up": {
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["SignUpInput"];
        };
      };
      responses: {
        201: {
          content: {
            "application/json": components["schemas"]["Credentials"];
          };
        };
      };
    };
  };

  "/v1/auth/sign-in": {
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["SignInInput"];
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["Credentials"];
          };
        };
      };
    };
  };

  "/v1/auth/log-out": {
    post: {
      requestBody?: never;
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["StatusResponse"];
          };
        };
      };
    };
  };

  "/v1/auth/refresh-tokens": {
    put: {
      requestBody?: never;
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["Credentials"];
          };
        };
      };
    };
  };

  "/v1/auth/forgot-password": {
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["ForgotPasswordInput"];
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["ForgotPasswordOutput"];
          };
        };
      };
    };
  };

  "/v1/auth/reset-password": {
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["ResetPasswordInput"];
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["StatusResponse"];
          };
        };
      };
    };
  };

  "/v1/auth/change-password": {
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["ChangePasswordInput"];
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["StatusResponse"];
          };
        };
      };
    };
  };

  "/v1/users/profile": {
    get: {
      requestBody?: never;
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
  };

  "/v1/users": {
    get: {
      parameters: {
        query?: components["schemas"]["PaginationQuery"];
      };
      requestBody?: never;
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["UserListResponse"];
          };
        };
      };
    };

    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["UserCreateInput"];
        };
      };
      responses: {
        201: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
  };

  "/v1/users/{id}": {
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody?: never;
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };

    put: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["UserUpdateInput"];
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };

    delete: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody?: never;
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["User"];
          };
        };
      };
    };
  };
}

export interface components {
  schemas: {
    /** User entity (without password and deletedAt) */
    User: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "USER" | "ADMIN";
      createdAt: string;
      updatedAt: string;
    };

    /** Sign-up request body */
    SignUpInput: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    };

    /** Sign-in request body */
    SignInInput: {
      email: string;
      password: string;
    };

    /** Forgot password request body */
    ForgotPasswordInput: {
      email: string;
    };

    /** Reset password request body */
    ResetPasswordInput: {
      password: string;
      token: string;
    };

    /** Change password request body */
    ChangePasswordInput: {
      newPassword: string;
      oldPassword: string;
    };

    /** Auth credentials response (sign-in, sign-up, refresh) */
    Credentials: {
      accessToken: string;
      refreshToken: string;
      user: components["schemas"]["User"];
    };

    /** Forgot password response */
    ForgotPasswordOutput: {
      status: boolean;
      resetToken?: string;
    };

    /** Generic status response */
    StatusResponse: {
      status: boolean;
    };

    /** Create user request body */
    UserCreateInput: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      role?: "USER" | "ADMIN";
    };

    /** Update user request body (all fields optional) */
    UserUpdateInput: {
      email?: string;
      firstName?: string;
      lastName?: string;
      password?: string;
      role?: "USER" | "ADMIN";
    };

    /** Offset pagination meta */
    PaginationMeta: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      itemCount: number;
      limit: number;
      page: number;
      pageCount: number;
    };

    /** Paginated user list response */
    UserListResponse: {
      data: components["schemas"]["User"][];
      meta: components["schemas"]["PaginationMeta"];
    };

    /** Pagination query parameters */
    PaginationQuery: {
      page?: number;
      limit?: number;
      sortBy?: string;
      search?: string;
      filter?: Record<string, unknown>;
    };
  };
}

/** Helper type to extract response body from a path */
export type ApiResponse<P extends keyof paths, M extends keyof paths[P]> = paths[P][M] extends { responses: infer R }
  ? R extends Record<number, { content: { "application/json": infer B } }>
    ? B
    : never
  : never;

/** Helper type to extract request body from a path */
export type ApiRequestBody<P extends keyof paths, M extends keyof paths[P]> = paths[P][M] extends {
  requestBody: { content: { "application/json": infer B } };
}
  ? B
  : never;
