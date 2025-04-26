import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت ساعت کاری
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند ساعت کاری را ببیند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const businessHours = await prisma.businessHour.findMany({
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return NextResponse.json(businessHours);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی ساعت کاری
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند ساعت کاری را تغییر دهد
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { businessHours } = body;

    // اعتبارسنجی داده‌ها
    if (!Array.isArray(businessHours)) {
      return NextResponse.json(
        { error: "Business hours must be an array" },
        { status: 400 }
      );
    }

    // بررسی اعتبار هر ساعت کاری
    for (const hour of businessHours) {
      if (
        !hour.dayOfWeek ||
        hour.dayOfWeek < 0 ||
        hour.dayOfWeek > 6 ||
        !hour.openTime ||
        !hour.closeTime ||
        hour.isClosed === undefined
      ) {
        return NextResponse.json(
          { error: "Invalid business hour data" },
          { status: 400 }
        );
      }
    }

    // به‌روزرسانی ساعت کاری
    const updatedHours = await Promise.all(
      businessHours.map(async (hour) => {
        return prisma.businessHour.upsert({
          where: {
            dayOfWeek: hour.dayOfWeek,
          },
          update: {
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isClosed: hour.isClosed,
          },
          create: {
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isClosed: hour.isClosed,
          },
        });
      })
    );

    return NextResponse.json(updatedHours);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 