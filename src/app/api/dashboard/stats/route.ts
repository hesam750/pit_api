import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

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

    // دریافت پارامترهای تاریخ
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // ساخت شرط‌های تاریخ
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // دریافت آمار کلی
    const [
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue,
      activeUsers,
      activeServices,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      averageRating,
      topCategories,
      topServices,
    ] = await Promise.all([
      // تعداد کل کاربران
      prisma.user.count(),
      
      // تعداد کل سرویس‌ها
      prisma.service.count(),
      
      // تعداد کل رزروها
      prisma.booking.count(),
      
      // درآمد کل
      prisma.booking.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: dateFilter,
        },
        _sum: {
          totalPrice: true,
        },
      }),
      
      // کاربران فعال
      prisma.user.count({
        where: {
          isActive: true,
        },
      }),
      
      // سرویس‌های فعال
      prisma.service.count({
        where: {
          isAvailable: true,
        },
      }),
      
      // رزروهای در انتظار
      prisma.booking.count({
        where: {
          status: "PENDING",
          createdAt: dateFilter,
        },
      }),
      
      // رزروهای تکمیل شده
      prisma.booking.count({
        where: {
          status: "COMPLETED",
          createdAt: dateFilter,
        },
      }),
      
      // رزروهای لغو شده
      prisma.booking.count({
        where: {
          status: "CANCELLED",
          createdAt: dateFilter,
        },
      }),
      
      // میانگین امتیازات
      prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),
      
      // دسته‌بندی‌های پرطرفدار
      prisma.category.findMany({
        take: 5,
        orderBy: {
          services: {
            _count: "desc",
          },
        },
        include: {
          _count: {
            select: {
              services: true,
            },
          },
        },
      }),
      
      // سرویس‌های پرطرفدار
      prisma.service.findMany({
        take: 5,
        orderBy: {
          bookings: {
            _count: "desc",
          },
        },
        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
          category: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalServices,
        totalBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        activeUsers,
        activeServices,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        averageRating: averageRating._avg.rating || 0,
      },
      topCategories,
      topServices,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 