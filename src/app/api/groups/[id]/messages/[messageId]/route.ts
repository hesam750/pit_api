import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت اطلاعات یک پیام خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string; messageId: string } }
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

    // دریافت پیام
    const message = await prisma.groupMessage.findUnique({
      where: {
        id: params.messageId,
        groupId: params.id,
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

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی یک پیام خاص
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // بررسی دسترسی به پیام
    const message = await prisma.groupMessage.findFirst({
      where: {
        id: params.messageId,
        groupId: params.id,
        senderId: session.user.id,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found or access denied" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { content } = body;

    // اعتبارسنجی داده‌ها
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // به‌روزرسانی پیام
    const updatedMessage = await prisma.groupMessage.update({
      where: {
        id: params.messageId,
      },
      data: {
        content,
        isEdited: true,
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

    return NextResponse.json(updatedMessage);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف یک پیام خاص
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // بررسی دسترسی به پیام
    const message = await prisma.groupMessage.findFirst({
      where: {
        id: params.messageId,
        groupId: params.id,
        OR: [
          { senderId: session.user.id },
          {
            group: {
              members: {
                some: {
                  userId: session.user.id,
                  role: "ADMIN",
                },
              },
            },
          },
        ],
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found or access denied" },
        { status: 404 }
      );
    }

    // حذف پیام
    await prisma.groupMessage.delete({
      where: {
        id: params.messageId,
      },
    });

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 