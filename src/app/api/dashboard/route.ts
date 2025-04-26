import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت آمار کلی سیستم
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند آمار را مشاهده کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // دریافت پارامترهای فیلتر
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // ایجاد فیلتر تاریخ
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    } : {};

    // آمار کلی
    const totalUsers = await prisma.user.count();
    const totalServices = await prisma.service.count();
    const totalBookings = await prisma.booking.count({
      where: dateFilter,
    });
    const totalPayments = await prisma.payment.count({
      where: dateFilter,
    });

    // آمار پرداخت‌ها
    const paymentStats = await prisma.payment.groupBy({
      by: ["status"],
      _count: true,
      _sum: {
        amount: true,
      },
      where: dateFilter,
    });

    // آمار رزروها
    const bookingStats = await prisma.booking.groupBy({
      by: ["status"],
      _count: true,
      where: dateFilter,
    });

    // محبوب‌ترین سرویس‌ها
    const popularServices = await prisma.booking.groupBy({
      by: ["serviceId"],
      _count: true,
      where: dateFilter,
      orderBy: {
        _count: {
          serviceId: "desc",
        },
      },
      take: 5,
    });

    // دریافت اطلاعات کامل سرویس‌های محبوب
    const popularServicesWithDetails = await Promise.all(
      popularServices.map(async (service) => {
        const serviceDetails = await prisma.service.findUnique({
          where: { id: service.serviceId },
          select: {
            id: true,
            name: true,
            price: true,
          },
        });
        return {
          ...service,
          service: serviceDetails,
        };
      })
    );

    // درآمد ماهانه
    const monthlyRevenue = await prisma.payment.groupBy({
      by: ["createdAt"],
      _sum: {
        amount: true,
      },
      where: {
        ...dateFilter,
        status: "SUCCESS",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // کاربران فعال
    const activeUsers = await prisma.booking.groupBy({
      by: ["userId"],
      _count: true,
      where: dateFilter,
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 5,
    });

    // دریافت اطلاعات کامل کاربران فعال
    const activeUsersWithDetails = await Promise.all(
      activeUsers.map(async (user) => {
        const userDetails = await prisma.user.findUnique({
          where: { id: user.userId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        return {
          ...user,
          user: userDetails,
        };
      })
    );

    return NextResponse.json({
      totalUsers,
      totalServices,
      totalBookings,
      totalPayments,
      paymentStats,
      bookingStats,
      popularServices: popularServicesWithDetails,
      monthlyRevenue,
      activeUsers: activeUsersWithDetails,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 