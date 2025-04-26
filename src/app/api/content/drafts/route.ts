import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت لیست پیش‌نویس‌ها
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند پیش‌نویس‌ها را ببیند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const authorId = searchParams.get("authorId");
    const type = searchParams.get("type");

    // ساخت شرط‌های فیلتر
    const where: any = {
      isDraft: true,
    };

    if (authorId) {
      where.authorId = authorId;
    }

    if (type) {
      where.type = type;
    }

    // دریافت پیش‌نویس‌ها
    const [drafts, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return NextResponse.json({
      drafts,
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

// ایجاد پیش‌نویس جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند پیش‌نویس ایجاد کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      content,
      type,
      metaTitle,
      metaDescription,
      tags,
    } = body;

    // اعتبارسنجی داده‌ها
    if (!title || !slug || !content || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // بررسی وجود محتوا با همین slug
    const existingContent = await prisma.content.findUnique({
      where: {
        slug,
      },
    });

    if (existingContent) {
      return NextResponse.json(
        { error: "Content with this slug already exists" },
        { status: 400 }
      );
    }

    // ایجاد پیش‌نویس
    const draft = await prisma.content.create({
      data: {
        title,
        slug,
        content,
        type,
        metaTitle,
        metaDescription,
        authorId: session.user.id,
        isDraft: true,
        tags: tags
          ? {
              connect: tags.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: true,
      },
    });

    return NextResponse.json(draft);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 