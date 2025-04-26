import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت اطلاعات یک قالب خاص
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند قالب‌ها را ببیند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی یک قالب خاص
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند قالب‌ها را به‌روز کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, type, variables } = body;

    // اعتبارسنجی داده‌ها
    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // بررسی وجود قالب دیگر با همین عنوان
    const existingTemplate = await prisma.messageTemplate.findFirst({
      where: {
        title,
        id: {
          not: params.id,
        },
      },
    });

    if (existingTemplate) {
      return NextResponse.json(
        { error: "Template with this title already exists" },
        { status: 400 }
      );
    }

    // به‌روزرسانی قالب
    const template = await prisma.messageTemplate.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
        type,
        variables,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف یک قالب خاص
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند قالب‌ها را حذف کند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // بررسی وجود قالب
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

    // حذف قالب
    await prisma.messageTemplate.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 