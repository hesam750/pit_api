import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت لیست تعطیلات
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تعطیلات را ببیند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const holidays = await prisma.holiday.findMany({
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(holidays);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ایجاد تعطیلی جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تعطیلی ایجاد کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { date, name, description } = body;

    // اعتبارسنجی داده‌ها
    if (!date || !name) {
      return NextResponse.json(
        { error: "Date and name are required" },
        { status: 400 }
      );
    }

    // بررسی وجود تعطیلی در همان تاریخ
    const existingHoliday = await prisma.holiday.findUnique({
      where: { date: new Date(date) },
    });

    if (existingHoliday) {
      return NextResponse.json(
        { error: "Holiday already exists for this date" },
        { status: 400 }
      );
    }

    const holiday = await prisma.holiday.create({
      data: {
        date: new Date(date),
        name,
        description,
      },
    });

    return NextResponse.json(holiday);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 