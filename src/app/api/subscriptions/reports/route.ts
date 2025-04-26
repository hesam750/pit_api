import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت گزارش‌های اشتراک
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const planId = searchParams.get("planId");

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (planId) {
      where.planId = planId;
    }

    const [
      totalSubscriptions,
      activeSubscriptions,
      cancelledSubscriptions,
      totalRevenue,
      subscriptionsByPlan,
      subscriptionsByDate,
    ] = await Promise.all([
      // تعداد کل اشتراک‌ها
      prisma.subscription.count({ where }),
      // تعداد اشتراک‌های فعال
      prisma.subscription.count({
        where: { ...where, status: "ACTIVE" },
      }),
      // تعداد اشتراک‌های لغو شده
      prisma.subscription.count({
        where: { ...where, status: "CANCELLED" },
      }),
      // درآمد کل
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          subscription: where,
        },
        _sum: {
          amount: true,
        },
      }),
      // تعداد اشتراک‌ها بر اساس پلن
      prisma.subscription.groupBy({
        by: ["planId"],
        where,
        _count: true,
      }),
      // تعداد اشتراک‌ها بر اساس تاریخ
      prisma.subscription.groupBy({
        by: ["createdAt"],
        where,
        _count: true,
      }),
    ]);

    // دریافت نام پلن‌ها
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        id: {
          in: subscriptionsByPlan.map((item) => item.planId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // ترکیب اطلاعات پلن‌ها با تعداد اشتراک‌ها
    const subscriptionsByPlanWithName = subscriptionsByPlan.map((item) => {
      const plan = plans.find((p) => p.id === item.planId);
      return {
        planId: item.planId,
        planName: plan?.name || "Unknown",
        count: item._count,
      };
    });

    await logAction("SUBSCRIPTION_REPORTS_VIEWED", null, session.user.id);

    return NextResponse.json({
      totalSubscriptions,
      activeSubscriptions,
      cancelledSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      subscriptionsByPlan: subscriptionsByPlanWithName,
      subscriptionsByDate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 