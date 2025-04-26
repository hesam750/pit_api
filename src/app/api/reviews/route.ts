import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/database";

// Get all reviews
export async function GET(req: Request) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create new review
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, rating, comment } = body;

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        userId: session.user.id,
        status: "COMPLETED",
      },
      include: {
        review: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or not completed" },
        { status: 404 }
      );
    }

    if (booking.review) {
      return NextResponse.json(
        { error: "Review already exists for this booking" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        bookingId,
        serviceId: booking.serviceType,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 