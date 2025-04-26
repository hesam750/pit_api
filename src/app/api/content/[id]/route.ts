import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت اطلاعات یک محتوای خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const content = await prisma.content.findUnique({
      where: {
        id: params.id,
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

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // فقط ادمین می‌تواند محتوای منتشر نشده را ببیند
    if (!content.isPublished && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی یک محتوای خاص
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند محتوا را به‌روز کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      content,
      type,
      isPublished,
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

    // به‌روزرسانی محتوا
    const updatedContent = await prisma.content.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        slug,
        content,
        type,
        isPublished,
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

    return NextResponse.json(updatedContent);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف یک محتوای خاص
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند محتوا را حذف کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // بررسی وجود محتوا
    const content = await prisma.content.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // حذف محتوا
    await prisma.content.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 