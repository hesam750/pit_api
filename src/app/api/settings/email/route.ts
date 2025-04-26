import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";
import { cache } from "@/utils/cache";
import prisma from "@/config/database";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate cache key
    const cacheKey = "email_settings";

    // Try to get from cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const settings = await prisma.emailSettings.findFirst();

    // Cache the response
    await cache.set(cacheKey, settings);

    await logAction("EMAIL_SETTINGS_VIEWED", null, session.user.id);

    return NextResponse.json(settings);
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
    const {
      host,
      port,
      username,
      password,
      fromEmail,
      fromName,
      secure,
      testEmail,
    } = body;

    if (!host || !port || !username || !password || !fromEmail || !fromName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update or create settings
    const settings = await prisma.emailSettings.upsert({
      where: { id: 1 },
      update: {
        host,
        port,
        username,
        password,
        fromEmail,
        fromName,
        secure,
        testEmail,
        updatedBy: session.user.id,
      },
      create: {
        host,
        port,
        username,
        password,
        fromEmail,
        fromName,
        secure,
        testEmail,
        createdBy: session.user.id,
      },
    });

    // Clear email settings cache
    await cache.delete("email_settings");

    await logAction(
      "EMAIL_SETTINGS_UPDATED",
      JSON.stringify({
        host,
        fromEmail,
        fromName,
      }),
      session.user.id
    );

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { error: "Test email is required" },
        { status: 400 }
      );
    }

    // Send test email
    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json(
        { error: "Email settings not found" },
        { status: 404 }
      );
    }

    // TODO: Implement test email sending
    // const result = await sendTestEmail(settings, testEmail);

    // Clear email settings cache
    await cache.delete("email_settings");

    await logAction(
      "EMAIL_TEST_SENT",
      JSON.stringify({
        testEmail,
      }),
      session.user.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 