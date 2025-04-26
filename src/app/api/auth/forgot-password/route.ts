import { NextResponse } from "next/server";
import prisma from "@/config/database";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/lib/email";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ایجاد توکن بازیابی
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 ساعت اعتبار

    // ذخیره توکن در دیتابیس
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // ارسال ایمیل بازیابی
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: "بازیابی رمز عبور",
      html: `
        <div dir="rtl">
          <h2>بازیابی رمز عبور</h2>
          <p>برای بازیابی رمز عبور خود روی لینک زیر کلیک کنید:</p>
          <a href="${resetUrl}">بازیابی رمز عبور</a>
          <p>این لینک تا 1 ساعت اعتبار دارد.</p>
          <p>اگر شما این درخواست را نکرده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 