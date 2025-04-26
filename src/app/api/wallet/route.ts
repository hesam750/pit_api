import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";
import { authOptions } from "@/config/auth";
import { logAction } from "@/lib/logger";

// دریافت اطلاعات کیف پول
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // دریافت کیف پول
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      include: {
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!wallet) {
      // ایجاد کیف پول جدید اگر وجود نداشت
      const newWallet = await prisma.wallet.create({
        data: {
          userId: session.user.id,
        },
        include: {
          transactions: true,
        },
      });

      await logAction("WALLET_CREATED", null, session.user.id);
      return NextResponse.json(newWallet);
    }

    await logAction("WALLET_VIEWED", null, session.user.id);
    return NextResponse.json(wallet);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ایجاد تراکنش جدید
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, type, description, referenceId } = await req.json();

    if (!amount || !type) {
      return NextResponse.json(
        { error: "Amount and type are required" },
        { status: 400 }
      );
    }

    // دریافت کیف پول
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    // بررسی موجودی برای برداشت
    if (type === "WITHDRAW" && wallet.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // ایجاد تراکنش
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type,
        description,
        referenceId,
      },
    });

    // به‌روزرسانی موجودی کیف پول
    const newBalance =
      type === "DEPOSIT" || type === "REFUND"
        ? wallet.balance + amount
        : wallet.balance - amount;

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance },
    });

    await logAction(
      `WALLET_${type}`,
      JSON.stringify({ amount, description }),
      session.user.id
    );

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 