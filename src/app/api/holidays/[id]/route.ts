import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت اطلاعات یک تعطیلی خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تعطیلی را ببیند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const holiday = await prisma.holiday.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!holiday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    return NextResponse.json(holiday);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ویرایش تعطیلی
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تعطیلی را ویرایش کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const holiday = await prisma.holiday.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!holiday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    const body = await req.json();
    const { date, name, description } = body;

    // اگر تاریخ تغییر کرده است، بررسی وجود تعطیلی دیگر در همان تاریخ
    if (date && new Date(date).getTime() !== holiday.date.getTime()) {
      const existingHoliday = await prisma.holiday.findUnique({
        where: { date: new Date(date) },
      });

      if (existingHoliday) {
        return NextResponse.json(
          { error: "Holiday already exists for this date" },
          { status: 400 }
        );
      }
    }

    const updatedHoliday = await prisma.holiday.update({
      where: {
        id: params.id,
      },
      data: {
        date: date ? new Date(date) : undefined,
        name,
        description,
      },
    });

    return NextResponse.json(updatedHoliday);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف تعطیلی
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند تعطیلی را حذف کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const holiday = await prisma.holiday.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!holiday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    await prisma.holiday.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 