import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت لیست اعلان‌ها
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const type = searchParams.get("type");
    const read = searchParams.get("read");
    const userId = searchParams.get("userId");

    const where: any = {
      OR: [
        { userId: session.user.id },
        { isPublic: true },
      ],
    };

    if (type) {
      where.type = type;
    }

    if (read !== null) {
      where.read = read === "true";
    }

    if (userId && session.user.role === "ADMIN") {
      where.userId = userId;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    await logAction("NOTIFICATIONS_VIEWED", null, session.user.id);

    return NextResponse.json({
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ایجاد اعلان جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, message, type, userId, isPublic, data } = await req.json();

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "Title, message and type are required" },
        { status: 400 }
      );
    }

    // اگر userId مشخص نشده، اعلان عمومی است
    if (!userId && !isPublic) {
      return NextResponse.json(
        { error: "Either userId or isPublic must be specified" },
        { status: 400 }
      );
    }

    // اگر userId مشخص شده، بررسی وجود کاربر
    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId,
        isPublic,
        data,
        createdBy: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await logAction(
      "NOTIFICATION_CREATED",
      JSON.stringify({ title, type, userId }),
      session.user.id
    );

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 