import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت لیست نقش‌ها
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند نقش‌ها را مشاهده کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // دریافت پارامترهای فیلتر
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // دریافت نقش‌ها
    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: "asc",
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
          permissions: true,
        },
      }),
      prisma.role.count(),
    ]);

    return NextResponse.json({
      roles,
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

// ایجاد نقش جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند نقش ایجاد کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, permissions } = body;

    // اعتبارسنجی داده‌ها
    if (!name || !permissions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // بررسی وجود نقش با همین نام
    const existingRole = await prisma.role.findUnique({
      where: {
        name,
      },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: "Role with this name already exists" },
        { status: 400 }
      );
    }

    // ایجاد نقش
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissions.map((id: string) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 