import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// دریافت لیست فایل‌ها
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const messageId = searchParams.get("messageId");
    const groupId = searchParams.get("groupId");

    // ساخت شرط‌های فیلتر
    const where: any = {};

    if (messageId) {
      where.messageId = messageId;
    }

    if (groupId) {
      where.groupMessageId = groupId;
    }

    // دریافت فایل‌ها
    const [files, total] = await Promise.all([
      prisma.messageFile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
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
      }),
      prisma.messageFile.count({ where }),
    ]);

    return NextResponse.json({
      files,
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

// آپلود فایل جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const messageId = formData.get("messageId") as string;
    const groupId = formData.get("groupId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    // بررسی نوع فایل
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // بررسی حجم فایل (حداکثر 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large" },
        { status: 400 }
      );
    }

    // ایجاد نام فایل منحصر به فرد
    const uniqueId = uuidv4();
    const extension = file.name.split(".").pop();
    const fileName = `${uniqueId}.${extension}`;

    // ذخیره فایل
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), "public", "uploads", "messages");
    await writeFile(join(uploadDir, fileName), buffer);

    // ایجاد رکورد فایل در دیتابیس
    const messageFile = await prisma.messageFile.create({
      data: {
        fileName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedById: session.user.id,
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

    return NextResponse.json(messageFile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 