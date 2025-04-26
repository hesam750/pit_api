import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت اطلاعات یک تخفیف
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const discount = await prisma.subscriptionDiscount.findUnique({
      where: { id: params.id },
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

    if (!discount) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }

    await logAction(
      "SUBSCRIPTION_DISCOUNT_VIEWED",
      JSON.stringify({ discountId: params.id }),
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

// به‌روزرسانی تخفیف
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const discount = await prisma.subscriptionDiscount.findUnique({
      where: { id: params.id },
    });

    if (!discount) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }

    // بررسی تکراری نبودن کد تخفیف
    if (code && code !== discount.code) {
      const existingDiscount = await prisma.subscriptionDiscount.findUnique({
        where: { code },
      });

      if (existingDiscount) {
        return NextResponse.json(
          { error: "Discount code already exists" },
          { status: 400 }
        );
      }
    }

    // بررسی وجود پلن
    if (planId && planId !== discount.planId) {
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return NextResponse.json(
          { error: "Plan not found" },
          { status: 404 }
        );
      }
    }

    const updatedDiscount = await prisma.subscriptionDiscount.update({
      where: { id: params.id },
      data: {
        code,
        planId,
        discountType,
        discountValue,
        startDate,
        endDate,
        maxUses,
        status,
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
      "SUBSCRIPTION_DISCOUNT_UPDATED",
      JSON.stringify({
        discountId: params.id,
        code,
        planId,
        discountType,
        discountValue,
      }),
      session.user.id
    );

    return NextResponse.json(updatedDiscount);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف تخفیف
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const discount = await prisma.subscriptionDiscount.findUnique({
      where: { id: params.id },
    });

    if (!discount) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }

    await prisma.subscriptionDiscount.delete({
      where: { id: params.id },
    });

    await logAction(
      "SUBSCRIPTION_DISCOUNT_DELETED",
      JSON.stringify({ discountId: params.id }),
      session.user.id
    );

    return NextResponse.json({ message: "Discount deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 