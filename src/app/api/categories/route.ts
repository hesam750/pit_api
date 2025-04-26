import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت لیست دسته‌بندی‌ها
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");
    const includeContent = searchParams.get("includeContent") === "true";
    const includeChildren = searchParams.get("includeChildren") === "true";

    const where: any = {};
    if (parentId) {
      where.parentId = parentId;
    } else {
      where.parentId = null;
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: includeChildren ? {
          include: {
            _count: {
              select: {
                content: true,
                children: true,
              },
            },
          },
        } : false,
        parent: true,
        _count: {
          select: {
            content: true,
            children: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    await logAction("CATEGORIES_VIEWED", null, session.user.id);

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ایجاد دسته‌بندی جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, description, parentId, order, image } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // بررسی تکراری نبودن slug
    const existingCategory = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    // اگر parentId مشخص شده، بررسی وجود دسته‌بندی والد
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: {
          id: parentId,
        },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId,
        order: order || 0,
        image,
      },
      include: {
        parent: true,
        _count: {
          select: {
            content: true,
            children: true,
          },
        },
      },
    });

    await logAction(
      "CATEGORY_CREATED",
      JSON.stringify({ name, slug, parentId }),
      session.user.id
    );

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 