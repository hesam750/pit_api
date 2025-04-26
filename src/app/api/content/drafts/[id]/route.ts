import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت اطلاعات یک پیش‌نویس خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند پیش‌نویس‌ها را ببیند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // دریافت پیش‌نویس
    const draft = await prisma.content.findUnique({
      where: {
        id: params.id,
        isDraft: true,
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

    if (!draft) {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(draft);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی یک پیش‌نویس خاص
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند پیش‌نویس‌ها را به‌روز کند
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

    // بررسی وجود محتوای دیگر با همین slug
    const existingContent = await prisma.content.findFirst({
      where: {
        slug,
        id: {
          not: params.id,
        },
      },
    });

    if (existingContent) {
      return NextResponse.json(
        { error: "Content with this slug already exists" },
        { status: 400 }
      );
    }

    // به‌روزرسانی پیش‌نویس
    const draft = await prisma.content.update({
      where: {
        id: params.id,
        isDraft: true,
      },
      data: {
        title,
        slug,
        content,
        type,
        metaTitle,
        metaDescription,
        tags: tags
          ? {
              set: tags.map((id: string) => ({ id })),
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

// حذف یک پیش‌نویس خاص
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند پیش‌نویس‌ها را حذف کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // بررسی وجود پیش‌نویس
    const draft = await prisma.content.findUnique({
      where: {
        id: params.id,
        isDraft: true,
      },
    });

    if (!draft) {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      );
    }

    // حذف پیش‌نویس
    await prisma.content.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Draft deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// انتشار یک پیش‌نویس
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند پیش‌نویس‌ها را منتشر کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // بررسی وجود پیش‌نویس
    const draft = await prisma.content.findUnique({
      where: {
        id: params.id,
        isDraft: true,
      },
    });

    if (!draft) {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      );
    }

    // انتشار پیش‌نویس
    const publishedContent = await prisma.content.update({
      where: {
        id: params.id,
      },
      data: {
        isDraft: false,
        isPublished: true,
        publishedAt: new Date(),
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

    return NextResponse.json(publishedContent);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 