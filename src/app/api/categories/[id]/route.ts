import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت اطلاعات یک دسته‌بندی
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            contents: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    await logAction("CATEGORY_VIEWED", params.id, session.user.id);

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// به‌روزرسانی دسته‌بندی
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const { name, slug, description, parentId, order, isActive } = await req.json();

    // اگر slug تغییر کرده، بررسی تکراری نبودن
    if (slug && slug !== category.slug) {
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
    }

    // اگر parentId تغییر کرده، بررسی وجود دسته‌بندی والد
    if (parentId && parentId !== category.parentId) {
      const parent = await prisma.category.findUnique({
        where: {
          id: parentId,
        },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }

      // بررسی چرخه در ساختار درختی
      if (parentId === params.id) {
        return NextResponse.json(
          { error: "Category cannot be its own parent" },
          { status: 400 }
        );
      }

      // بررسی چرخه در ساختار درختی (عمیق)
      let currentParent = await prisma.category.findUnique({
        where: {
          id: parentId,
        },
        select: {
          id: true,
          parentId: true,
        },
      });

      while (currentParent?.parentId) {
        if (currentParent.parentId === params.id) {
          return NextResponse.json(
            { error: "Circular reference in category hierarchy" },
            { status: 400 }
          );
        }
        currentParent = await prisma.category.findUnique({
          where: {
            id: currentParent.parentId,
          },
          select: {
            id: true,
            parentId: true,
          },
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        slug,
        description,
        parentId,
        order,
        isActive,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            contents: true,
            children: true,
          },
        },
      },
    });

    await logAction(
      "CATEGORY_UPDATED",
      JSON.stringify({ name, slug, parentId }),
      session.user.id
    );

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// حذف دسته‌بندی
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            contents: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // بررسی وجود محتوا یا زیردسته‌بندی
    if (category._count.contents > 0 || category._count.children > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with contents or subcategories",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    await logAction("CATEGORY_DELETED", params.id, session.user.id);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 