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
    const cacheKey = "sms_settings";

    // Try to get from cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const settings = await prisma.smsSettings.findFirst();

    // Cache the response
    await cache.set(cacheKey, settings);

    await logAction("SMS_SETTINGS_VIEWED", null, session.user.id);

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
      provider,
      apiKey,
      apiSecret,
      senderNumber,
      senderName,
      testNumber,
    } = body;

    if (!provider || !apiKey || !apiSecret || !senderNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update or create settings
    const settings = await prisma.smsSettings.upsert({
      where: { id: 1 },
      update: {
        provider,
        apiKey,
        apiSecret,
        senderNumber,
        senderName,
        testNumber,
        updatedBy: session.user.id,
      },
      create: {
        provider,
        apiKey,
        apiSecret,
        senderNumber,
        senderName,
        testNumber,
        createdBy: session.user.id,
      },
    });

    // Clear SMS settings cache
    await cache.delete("sms_settings");

    await logAction(
      "SMS_SETTINGS_UPDATED",
      JSON.stringify({
        provider,
        senderNumber,
        senderName,
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
    const { testNumber } = body;

    if (!testNumber) {
      return NextResponse.json(
        { error: "Test number is required" },
        { status: 400 }
      );
    }

    // Send test SMS
    const settings = await prisma.smsSettings.findFirst();
    if (!settings) {
      return NextResponse.json(
        { error: "SMS settings not found" },
        { status: 404 }
      );
    }

    // TODO: Implement test SMS sending
    // const result = await sendTestSMS(settings, testNumber);

    // Clear SMS settings cache
    await cache.delete("sms_settings");

    await logAction(
      "SMS_TEST_SENT",
      JSON.stringify({
        testNumber,
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