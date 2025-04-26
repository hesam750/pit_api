import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";
import bcrypt from "bcryptjs";
import {
  validateRequest,
  sanitizeInput,
  emailSchema,
  passwordSchema,
  nameSchema,
  phoneSchema,
} from "@/utils/validation";
import { cache } from "@/utils/cache";
import { query } from "@/utils/query";
import { z } from "zod";

// Schema for user creation
const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

// Schema for user update
const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

// دریافت لیست کاربران
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Generate cache key
    const cacheKey = cache.generateKey("users", {
      page,
      limit,
      role,
      search,
      sort,
      order,
    });

    // Try to get from cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Build query
    let baseQuery: any = {};

    // Apply filters
    if (role) {
      baseQuery.where = { ...baseQuery.where, role };
    }

    // Apply search
    if (search) {
      baseQuery = query.search(baseQuery, ["name", "email"], search);
    }

    // Apply sorting
    baseQuery = query.sort(baseQuery, sort, order as "asc" | "desc");

    // Apply pagination
    baseQuery = query.paginate(baseQuery, page, limit);

    // Select fields
    baseQuery = query.select(baseQuery, [
      "id",
      "name",
      "email",
      "role",
      "image",
      "createdAt",
    ]);

    // Include counts
    baseQuery.include = {
      _count: {
        select: {
          subscriptions: true,
          payments: true,
          reviews: true,
        },
      },
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany(baseQuery),
      prisma.user.count({ where: baseQuery.where }),
    ]);

    const response = {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the response
    await cache.set(cacheKey, response);

    await logAction("USERS_VIEWED", null, session.user.id);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ایجاد کاربر جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const sanitizedBody = sanitizeInput(body);

    // Validate request data
    const validation = await validateRequest(createUserSchema, sanitizedBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    // Clear users cache
    await cache.delete("users:*");

    await logAction(
      "USER_CREATED",
      JSON.stringify({ userId: user.id, email, role }),
      session.user.id
    );

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 