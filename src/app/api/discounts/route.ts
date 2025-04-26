import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت لیست تخفیف‌ها
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // دریافت پارامترهای فیلتر
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const isActive = searchParams.get("isActive") === "true";
    const type = searchParams.get("type");

    // ساخت شرط‌های فیلتر
    const where: any = {};

    if (isActive) {
      where.isActive = true;
      where.startDate = {
        lte: new Date(),
      };
      where.endDate = {
        gte: new Date(),
      };
    }

    if (type) {
      where.type = type;
    }

    // دریافت تخفیف‌ها
    const [discounts, total] = await Promise.all([
      prisma.discount.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              usages: true,
            },
          },
        },
      }),
      prisma.discount.count({ where }),
    ]);

    return NextResponse.json({
      discounts,
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

// ایجاد تخفیف جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تخفیف ایجاد کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      code,
      type,
      value,
      maxUses,
      startDate,
      endDate,
      minAmount,
      serviceIds,
      categoryIds,
    } = body;

    // اعتبارسنجی داده‌ها
    if (!code || !type || !value || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // بررسی وجود کد تخفیف
    const existingDiscount = await prisma.discount.findUnique({
      where: {
        code,
      },
    });

    if (existingDiscount) {
      return NextResponse.json(
        { error: "Discount code already exists" },
        { status: 400 }
      );
    }

    // ایجاد تخفیف
    const discount = await prisma.discount.create({
      data: {
        code,
        type,
        value,
        maxUses,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        minAmount,
        isActive: true,
        services: serviceIds
          ? {
              connect: serviceIds.map((id: string) => ({ id })),
            }
          : undefined,
        categories: categoryIds
          ? {
              connect: categoryIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        services: true,
        categories: true,
      },
    });

    return NextResponse.json(discount);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 