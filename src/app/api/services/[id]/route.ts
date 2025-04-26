import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت اطلاعات یک سرویس خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: {
        id: params.id,
      },
      include: {
        reviews: {
          select: {
            rating: true,
            comment: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ویرایش سرویس
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند سرویس را ویرایش کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = await prisma.service.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, price, duration, isActive } = body;

    // اعتبارسنجی داده‌ها
    if (price && price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (duration && duration <= 0) {
      return NextResponse.json(
        { error: "Duration must be greater than 0" },
        { status: 400 }
      );
    }

    const updatedService = await prisma.service.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        price,
        duration,
        isActive,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف سرویس
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند سرویس را حذف کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = await prisma.service.findUnique({
      where: {
        id: params.id,
      },
      include: {
        bookings: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // اگر سرویس در رزروهای فعال استفاده شده، نمی‌توان آن را حذف کرد
    const activeBookings = service.bookings.filter(
      (booking) => booking.status === "PENDING" || booking.status === "CONFIRMED"
    );

    if (activeBookings.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete service with active bookings" },
        { status: 400 }
      );
    }

    await prisma.service.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 