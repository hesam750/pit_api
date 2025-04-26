import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت اطلاعات یک تخفیف خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تخفیف‌ها را مشاهده کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const discount = await prisma.discount.findUnique({
      where: {
        id: params.id,
      },
      include: {
        services: true,
        categories: true,
        _count: {
          select: {
            usages: true,
          },
        },
      },
    });

    if (!discount) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(discount);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی یک تخفیف خاص
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تخفیف‌ها را به‌روز کند
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
      isActive,
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

    // بررسی وجود کد تخفیف دیگر با همین نام
    const existingDiscount = await prisma.discount.findFirst({
      where: {
        code,
        id: {
          not: params.id,
        },
      },
    });

    if (existingDiscount) {
      return NextResponse.json(
        { error: "Discount code already exists" },
        { status: 400 }
      );
    }

    // به‌روزرسانی تخفیف
    const discount = await prisma.discount.update({
      where: {
        id: params.id,
      },
      data: {
        code,
        type,
        value,
        maxUses,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        minAmount,
        isActive,
        services: serviceIds
          ? {
              set: serviceIds.map((id: string) => ({ id })),
            }
          : undefined,
        categories: categoryIds
          ? {
              set: categoryIds.map((id: string) => ({ id })),
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

// حذف یک تخفیف خاص
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تخفیف‌ها را حذف کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // بررسی وجود تخفیف
    const discount = await prisma.discount.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!discount) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }

    // حذف تخفیف
    await prisma.discount.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Discount deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 