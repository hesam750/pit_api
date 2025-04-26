import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";
import { cache } from "@/utils/cache";
import { query } from "@/utils/query";
import prisma from "@/config/database";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Generate cache key
    const cacheKey = cache.generateKey("financial_reports", {
      startDate,
      endDate,
      type,
      page,
      limit,
    });

    // Try to get from cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Build query
    let baseQuery: any = {
      where: {
        AND: [],
      },
    };

    // Apply date range
    if (startDate && endDate) {
      baseQuery.where.AND.push({
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      });
    }

    // Apply type filter
    if (type) {
      baseQuery.where.AND.push({ type });
    }

    // Apply pagination
    baseQuery = query.paginate(baseQuery, page, limit);

    // Select fields
    baseQuery = query.select(baseQuery, [
      "id",
      "type",
      "amount",
      "description",
      "date",
      "createdAt",
    ]);

    const [reports, total] = await Promise.all([
      prisma.financialReport.findMany(baseQuery),
      prisma.financialReport.count({ where: baseQuery.where }),
    ]);

    // Calculate totals
    const totals = await prisma.financialReport.aggregate({
      where: baseQuery.where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const response = {
      reports,
      totals: {
        amount: totals._sum.amount || 0,
        count: totals._count.id,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the response
    await cache.set(cacheKey, response);

    await logAction("FINANCIAL_REPORTS_VIEWED", null, session.user.id);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, amount, description, date } = body;

    if (!type || !amount || !description || !date) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const report = await prisma.financialReport.create({
      data: {
        type,
        amount,
        description,
        date: new Date(date),
        createdBy: session.user.id,
      },
    });

    // Clear financial reports cache
    await cache.delete("financial_reports:*");

    await logAction(
      "FINANCIAL_REPORT_CREATED",
      JSON.stringify({
        reportId: report.id,
        type,
        amount,
      }),
      session.user.id
    );

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 