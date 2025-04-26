import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت اطلاعات یک برچسب
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tag = await prisma.tag.findUnique({
      where: {
        id: params.id,
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            content: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    await logAction("TAG_VIEWED", params.id, session.user.id);

    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی برچسب
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, color } = await req.json();

    const tag = await prisma.tag.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    // بررسی تکراری نبودن نام
    if (name && name !== tag.name) {
      const existingTag = await prisma.tag.findUnique({
        where: {
          name,
        },
      });

      if (existingTag) {
        return NextResponse.json(
          { error: "Tag with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedTag = await prisma.tag.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        color,
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            content: true,
          },
        },
      },
    });

    await logAction(
      "TAG_UPDATED",
      JSON.stringify({ name, description }),
      session.user.id
    );

    return NextResponse.json(updatedTag);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف برچسب
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tag = await prisma.tag.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            content: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    if (tag._count.content > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag with content" },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: {
        id: params.id,
      },
    });

    await logAction("TAG_DELETED", params.id, session.user.id);

    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 