import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// بررسی در دسترس بودن زمان
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // دریافت پارامترهای فیلتر
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");

    // اعتبارسنجی داده‌ها
    if (!date || !serviceId) {
      return NextResponse.json(
        { error: "Date and service ID are required" },
        { status: 400 }
      );
    }

    // بررسی وجود سرویس
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // بررسی تعطیل بودن روز
    const isHoliday = await prisma.holiday.findUnique({
      where: { date: new Date(date) },
    });

    if (isHoliday) {
      return NextResponse.json({
        isAvailable: false,
        reason: "Holiday",
        holiday: isHoliday,
      });
    }

    // بررسی ساعت کاری
    const dayOfWeek = new Date(date).getDay();
    const businessHour = await prisma.businessHour.findUnique({
      where: { dayOfWeek },
    });

    if (!businessHour || businessHour.isClosed) {
      return NextResponse.json({
        isAvailable: false,
        reason: "Business is closed on this day",
      });
    }

    // دریافت رزروهای موجود برای این تاریخ و سرویس
    const existingBookings = await prisma.booking.findMany({
      where: {
        serviceId,
        date: new Date(date),
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        time: true,
      },
    });

    // تولید لیست زمان‌های در دسترس
    const availableSlots = [];
    const startTime = new Date(`1970-01-01T${businessHour.openTime}`);
    const endTime = new Date(`1970-01-01T${businessHour.closeTime}`);
    const interval = 30; // فاصله زمانی بین رزروها (دقیقه)

    let currentTime = startTime;
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      const isBooked = existingBookings.some(
        (booking) => booking.time === timeString
      );

      if (!isBooked) {
        availableSlots.push(timeString);
      }

      currentTime = new Date(currentTime.getTime() + interval * 60000);
    }

    return NextResponse.json({
      isAvailable: availableSlots.length > 0,
      availableSlots,
      businessHours: {
        open: businessHour.openTime,
        close: businessHour.closeTime,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 