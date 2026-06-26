import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Booking } from '@/database';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, email, eventId } = body;

    if (!name || !email || !eventId) {
      return NextResponse.json(
        { error: 'Name, email, and eventId are required.' },
        { status: 400 }
      );
    }

    // Check if a booking already exists for this email and event
    const existingBooking = await Booking.findOne({ email, eventId });
    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this event with this email.' },
        { status: 409 }
      );
    }

    // Create the new booking
    const newBooking = new Booking({
      name,
      email,
      eventId,
    });

    await newBooking.save();

    return NextResponse.json(
      { message: 'Booking successful', booking: newBooking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API Error] POST /api/bookings failed:', error);
    
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError' || error.message?.includes('Validation Error')) {
      return NextResponse.json(
        { error: error.message || 'Validation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error: Unable to book event' },
      { status: 500 }
    );
  }
}
