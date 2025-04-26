import { OpenAPIV3 } from "openapi-types";

export const swaggerConfig: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "PIT API Documentation",
    version: "1.0.0",
    description: "API documentation for PIT system",
    contact: {
      name: "PIT Support",
      email: "support@pit.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          image: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      File: {
        type: "object",
        properties: {
          id: { type: "string" },
          filename: { type: "string" },
          originalName: { type: "string" },
          path: { type: "string" },
          type: { type: "string" },
          size: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      FinancialReport: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          amount: { type: "number" },
          description: { type: "string" },
          date: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      EmailSettings: {
        type: "object",
        properties: {
          id: { type: "string" },
          host: { type: "string" },
          port: { type: "integer" },
          username: { type: "string" },
          fromEmail: { type: "string" },
          fromName: { type: "string" },
          secure: { type: "boolean" },
        },
      },
      SMSSettings: {
        type: "object",
        properties: {
          id: { type: "string" },
          provider: { type: "string" },
          senderNumber: { type: "string" },
          senderName: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/api/users": {
      get: {
        summary: "Get users list",
        description: "Retrieve a list of users with pagination and filtering",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "role",
            in: "query",
            description: "Filter by role",
            schema: { type: "string", enum: ["USER", "ADMIN"] },
          },
          {
            name: "search",
            in: "query",
            description: "Search term",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        totalPages: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create new user",
        description: "Create a new user account",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  role: { type: "string", enum: ["USER", "ADMIN"] },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    // Add other API paths here...
  },
}; 