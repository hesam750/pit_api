import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/config/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // پردازش رویدادهای مختلف
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          return NextResponse.json(
            { error: "Missing bookingId in session metadata" },
            { status: 400 }
          );
        }

        // به‌روزرسانی وضعیت پرداخت و رزرو
        await prisma.$transaction(async (tx) => {
          // به‌روزرسانی وضعیت پرداخت
          await tx.payment.update({
            where: {
              stripeSessionId: session.id,
            },
            data: {
              status: "COMPLETED",
            },
          });

          // به‌روزرسانی وضعیت رزرو
          await tx.booking.update({
            where: {
              id: bookingId,
            },
            data: {
              status: "CONFIRMED",
            },
          });
        });

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        // به‌روزرسانی وضعیت پرداخت
        await prisma.payment.update({
          where: {
            stripeSessionId: session.id,
          },
          data: {
            status: "FAILED",
          },
        });

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const sessionId = charge.payment_intent as string;

        // به‌روزرسانی وضعیت پرداخت
        await prisma.payment.update({
          where: {
            stripeSessionId: sessionId,
          },
          data: {
            status: "REFUNDED",
          },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 