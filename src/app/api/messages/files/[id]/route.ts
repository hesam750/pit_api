import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { unlink } from "fs/promises";
import { join } from "path";

// دریافت اطلاعات یک فایل خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // دریافت فایل
    const file = await prisma.messageFile.findUnique({
      where: {
        id: params.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی یک فایل خاص
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // بررسی وجود فایل
    const file = await prisma.messageFile.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // فقط آپلود کننده یا ادمین می‌تواند فایل را به‌روز کند
    if (file.uploadedById !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { messageId, groupId } = body;

    // به‌روزرسانی فایل
    const updatedFile = await prisma.messageFile.update({
      where: {
        id: params.id,
      },
      data: {
        messageId: messageId || null,
        groupMessageId: groupId || null,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف یک فایل خاص
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // بررسی وجود فایل
    const file = await prisma.messageFile.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // فقط آپلود کننده یا ادمین می‌تواند فایل را حذف کند
    if (file.uploadedById !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // حذف فایل از سیستم فایل
    const filePath = join(process.cwd(), "public", "uploads", "messages", file.fileName);
    await unlink(filePath);

    // حذف رکورد فایل از دیتابیس
    await prisma.messageFile.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 