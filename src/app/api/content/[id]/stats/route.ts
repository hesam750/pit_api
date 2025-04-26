import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";

// دریافت آمار بازدید محتوا
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فقط ادمین می‌تواند آمار را ببیند
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    // ساخت شرط‌های تاریخ
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // دریافت آمار
    const [
      totalViews,
      uniqueVisitors,
      averageTimeSpent,
      viewsByDate,
      topReferrers,
      topCountries,
    ] = await Promise.all([
      // تعداد کل بازدیدها
      prisma.contentView.count({
        where: {
          contentId: params.id,
          createdAt: dateFilter,
        },
      }),

      // تعداد بازدیدکنندگان منحصر به فرد
      prisma.contentView.count({
        where: {
          contentId: params.id,
          createdAt: dateFilter,
        },
        distinct: ["userId"],
      }),

      // میانگین زمان صرف شده
      prisma.contentView.aggregate({
        where: {
          contentId: params.id,
          createdAt: dateFilter,
        },
        _avg: {
          timeSpent: true,
        },
      }),

      // تعداد بازدیدها به تفکیک تاریخ
      prisma.contentView.groupBy({
        by: ["createdAt"],
        where: {
          contentId: params.id,
          createdAt: dateFilter,
        },
        _count: {
          _all: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // منابع ارجاع برتر
      prisma.contentView.groupBy({
        by: ["referrer"],
        where: {
          contentId: params.id,
          createdAt: dateFilter,
          referrer: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            _all: "desc",
          },
        },
        take: 10,
      }),

      // کشورهای برتر
      prisma.contentView.groupBy({
        by: ["country"],
        where: {
          contentId: params.id,
          createdAt: dateFilter,
          country: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            _all: "desc",
          },
        },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      averageTimeSpent: averageTimeSpent._avg.timeSpent || 0,
      viewsByDate,
      topReferrers,
      topCountries,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ثبت بازدید جدید
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { timeSpent, referrer, country } = body;

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

    // ثبت بازدید
    const view = await prisma.contentView.create({
      data: {
        contentId: params.id,
        userId: session.user.id,
        timeSpent,
        referrer,
        country,
      },
    });

    return NextResponse.json(view);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 