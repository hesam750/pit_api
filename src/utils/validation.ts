import { z } from "zod";

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

// API request validation
export const validateRequest = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((err) => err.message).join(", "),
      };
    }
    return { success: false, error: "Validation failed" };
  }
};

// Sanitize input data
export const sanitizeInput = (data: unknown): unknown => {
  if (typeof data === "string") {
    return data.trim();
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        sanitizeInput(value),
      ])
    );
  }
  return data;
};

// Validate file upload
export const validateFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [] } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
};

// Validate date range
export const validateDateRange = (
  startDate: Date,
  endDate: Date
): { valid: boolean; error?: string } => {
  if (startDate > endDate) {
    return {
      valid: false,
      error: "Start date must be before end date",
    };
  }

  return { valid: true };
};

// Validate numeric range
export const validateNumericRange = (
  value: number,
  min: number,
  max: number
): { valid: boolean; error?: string } => {
  if (value < min || value > max) {
    return {
      valid: false,
      error: `Value must be between ${min} and ${max}`,
    };
  }

  return { valid: true };
};

// Validate URL
export const validateUrl = (url: string): { valid: boolean; error?: string } => {
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: "Invalid URL format",
    };
  }
};

// Validate JSON
export const validateJson = (json: string): { valid: boolean; error?: string } => {
  try {
    JSON.parse(json);
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: "Invalid JSON format",
    };
  }
}; 