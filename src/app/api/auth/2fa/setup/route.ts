import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ایجاد کلید مخفی
    const secret = authenticator.generateSecret();
    
    // ایجاد کد QR
    const otpauth = authenticator.keyuri(
      session.user.email,
      "PitStop",
      secret
    );
    const qrCode = await QRCode.toDataURL(otpauth);

    // ایجاد کدهای پشتیبان
    const backupCodes = Array.from({ length: 8 }, () => uuidv4().slice(0, 8));

    // ذخیره اطلاعات در دیتابیس
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret,
        backupCodes: JSON.stringify(backupCodes),
      },
    });

    return NextResponse.json({
      secret,
      qrCode,
      backupCodes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 