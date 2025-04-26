import { NextResponse } from "next/server";
import prisma from "@/config/database";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // دریافت پارامترهای جستجو
    const query = searchParams.get("query") || "";
    const categoryId = searchParams.get("categoryId");
    const tagIds = searchParams.get("tagIds")?.split(",") || [];
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const isAvailable = searchParams.get("isAvailable") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // ساخت شرط‌های جستجو
    const where: any = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        { price: { gte: minPrice, lte: maxPrice } },
        { averageRating: { gte: minRating } },
      ],
    };

    // اضافه کردن فیلتر دسته‌بندی
    if (categoryId) {
      where.AND.push({ categoryId });
    }

    // اضافه کردن فیلتر تگ‌ها
    if (tagIds.length > 0) {
      where.AND.push({
        tags: {
          some: {
            id: {
              in: tagIds,
            },
          },
        },
      });
    }

    // اضافه کردن فیلتر دسترسی
    if (isAvailable) {
      where.AND.push({ isAvailable: true });
    }

    // دریافت سرویس‌ها
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          category: true,
          tags: true,
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 