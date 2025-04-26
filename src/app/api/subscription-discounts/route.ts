import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت لیست تخفیف‌ها
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status");
    const planId = searchParams.get("planId");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (planId) {
      where.planId = planId;
    }

    const [discounts, total] = await Promise.all([
      prisma.subscriptionDiscount.findMany({
        where,
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
        orderBy: {
          [sort]: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscriptionDiscount.count({ where }),
    ]);

    await logAction("SUBSCRIPTION_DISCOUNTS_VIEWED", null, session.user.id);

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

    const {
      code,
      planId,
      discountType,
      discountValue,
      startDate,
      endDate,
      maxUses,
      status,
    } = await req.json();

    if (!code || !planId || !discountType || !discountValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // بررسی وجود پلن
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // بررسی تکراری نبودن کد تخفیف
    const existingDiscount = await prisma.subscriptionDiscount.findUnique({
      where: { code },
    });

    if (existingDiscount) {
      return NextResponse.json(
        { error: "Discount code already exists" },
        { status: 400 }
      );
    }

    const discount = await prisma.subscriptionDiscount.create({
      data: {
        code,
        planId,
        discountType,
        discountValue,
        startDate,
        endDate,
        maxUses,
        status: status || "ACTIVE",
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    await logAction(
      "SUBSCRIPTION_DISCOUNT_CREATED",
      JSON.stringify({ code, planId, discountType, discountValue }),
      session.user.id
    );

    return NextResponse.json(discount);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 