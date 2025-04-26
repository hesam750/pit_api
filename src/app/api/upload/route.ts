import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";
import { cache } from "@/utils/cache";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { validateFile } from "@/utils/validation";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file, {
      maxSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_TYPES,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique filename
    const extension = file.name.split(".").pop();
    const filename = `${uuidv4()}.${extension}`;
    const path = join(process.cwd(), "public/uploads", type || "general", filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path, buffer);

    // Create file record
    const fileRecord = await prisma.file.create({
      data: {
        filename,
        originalName: file.name,
        path: `/uploads/${type || "general"}/${filename}`,
        type: file.type,
        size: file.size,
        uploadedBy: session.user.id,
      },
    });

    // Clear uploads cache
    await cache.delete("uploads:*");

    await logAction(
      "FILE_UPLOADED",
      JSON.stringify({
        fileId: fileRecord.id,
        filename: file.name,
        type: file.type,
      }),
      session.user.id
    );

    return NextResponse.json(fileRecord);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Generate cache key
    const cacheKey = cache.generateKey("uploads", {
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
    let baseQuery: any = {};

    if (type) {
      baseQuery.where = { type };
    }

    // Apply pagination
    baseQuery = query.paginate(baseQuery, page, limit);

    // Select fields
    baseQuery = query.select(baseQuery, [
      "id",
      "filename",
      "originalName",
      "path",
      "type",
      "size",
      "createdAt",
    ]);

    const [files, total] = await Promise.all([
      prisma.file.findMany(baseQuery),
      prisma.file.count({ where: baseQuery.where }),
    ]);

    const response = {
      files,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the response
    await cache.set(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 