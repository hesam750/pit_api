import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت پیام‌های یک گروه
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // بررسی عضویت در گروه
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
    });

    if (!groupMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const cursor = searchParams.get("cursor");

    // دریافت پیام‌ها
    const messages = await prisma.groupMessage.findMany({
      where: {
        groupId: params.id,
        ...(cursor
          ? {
              id: {
                lt: cursor,
              },
            }
          : {}),
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      messages,
      nextCursor: messages.length === limit ? messages[messages.length - 1].id : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ارسال پیام جدید در گروه
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // بررسی عضویت در گروه
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
    });

    if (!groupMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { content, replyToId } = body;

    // اعتبارسنجی داده‌ها
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // بررسی وجود پیام پاسخ
    if (replyToId) {
      const replyToMessage = await prisma.groupMessage.findFirst({
        where: {
          id: replyToId,
          groupId: params.id,
        },
      });

      if (!replyToMessage) {
        return NextResponse.json(
          { error: "Reply message not found" },
          { status: 404 }
        );
      }
    }

    // ایجاد پیام جدید
    const message = await prisma.groupMessage.create({
      data: {
        content,
        groupId: params.id,
        senderId: session.user.id,
        replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // به‌روزرسانی زمان آخرین فعالیت گروه
    await prisma.group.update({
      where: {
        id: params.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 