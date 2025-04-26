import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت لیست تنظیمات
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");

    const where: any = {};
    if (category) {
      where.category = category;
    }

    const [settings, total] = await Promise.all([
      prisma.setting.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          category: "asc",
        },
      }),
      prisma.setting.count({ where }),
    ]);

    await logAction("SETTINGS_VIEWED", null, session.user.id);

    return NextResponse.json({
      settings,
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

// ایجاد تنظیم جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value, category, description, isPublic } = await req.json();

    if (!key || !value || !category) {
      return NextResponse.json(
        { error: "Key, value and category are required" },
        { status: 400 }
      );
    }

    const existingSetting = await prisma.setting.findUnique({
      where: {
        key,
      },
    });

    if (existingSetting) {
      return NextResponse.json(
        { error: "Setting key already exists" },
        { status: 400 }
      );
    }

    const setting = await prisma.setting.create({
      data: {
        key,
        value,
        category,
        description,
        isPublic,
      },
    });

    await logAction(
      "SETTING_CREATED",
      JSON.stringify({ key, category }),
      session.user.id
    );

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 