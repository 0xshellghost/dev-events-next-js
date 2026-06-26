import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Event } from '@/database';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary will automatically pick up the CLOUDINARY_URL environment variable.
// If individual variables are provided, we can optionally configure them:
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse the incoming JSON body
    const body = await request.json();

    // If the body contains an image (Base64 data URL), upload it to Cloudinary
    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'dev-events',
      });
      // Replace the Base64 string with the Cloudinary secure URL
      body.image = uploadResponse.secure_url;
    }

    // Create a new event using the Mongoose model
    // The pre-save hook will automatically handle validation, slug generation, and formatting
    const newEvent = new Event(body);
    await newEvent.save();

    // Return the newly created event with a 201 Created status
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('[API Error] POST /api/events failed:', error);

    // If it's a Mongoose validation error, return a 400 Bad Request
    if (error.name === 'ValidationError' || error.message?.includes('Validation Error')) {
      return NextResponse.json(
        { error: error.message || 'Validation failed' },
        { status: 400 }
      );
    }

    // Handle Mongo duplicate key error (e.g., if a slug manually provided conflicts, though slug is auto-generated)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An event with this title/slug already exists.' },
        { status: 409 }
      );
    }

    // For any other unexpected error, return a 500
    return NextResponse.json(
      { error: 'Internal Server Error: Unable to create event' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all events, sorted by newest first
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('[API Error] GET /api/events failed:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: Unable to fetch events' },
      { status: 500 }
    );
  }
}
