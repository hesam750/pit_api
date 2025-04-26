import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// استفاده از یک قالب پیام
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // دریافت قالب
    const template = await prisma.messageTemplate.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { variables, groupId, userId } = body;

    // اعتبارسنجی داده‌ها
    if (!variables || typeof variables !== "object") {
      return NextResponse.json(
        { error: "Variables are required" },
        { status: 400 }
      );
    }

    // جایگزینی متغیرها در محتوا
    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), String(value));
    }

    // ارسال پیام
    if (groupId) {
      // بررسی عضویت در گروه
      const groupMember = await prisma.groupMember.findFirst({
        where: {
          groupId,
          userId: session.user.id,
        },
      });

      if (!groupMember) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // ایجاد پیام گروهی
      const message = await prisma.groupMessage.create({
        data: {
          content,
          groupId,
          senderId: session.user.id,
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

      // به‌روزرسانی زمان آخرین فعالیت گروه
      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(message);
    } else if (userId) {
      // ایجاد پیام خصوصی
      const message = await prisma.message.create({
        data: {
          content,
          senderId: session.user.id,
          receiverId: userId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json(message);
    } else {
      return NextResponse.json(
        { error: "Either groupId or userId is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 