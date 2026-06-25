import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/database/event.model';
import { getPostHogClient } from '@/lib/posthog-server';

// Interface defining the expected route parameters for Next.js App Router
interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET API Route to fetch an event by its unique slug.
 * Endpoint: /api/events/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // In Next.js 15+, dynamic route params are asynchronous and must be awaited.
    const { slug } = await params;

    // Validate that the slug parameter was provided
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    // Ensure database connection is active
    await connectToDatabase();

    // Query the database for the event matching the provided slug
    // Use .lean() to return a plain JavaScript object instead of a Mongoose document
    const event = await Event.findOne({ slug }).lean();

    // If no matching event is found, return a 404 response
    if (!event) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: 'anonymous',
        event: 'event_not_found',
        properties: { slug },
      });
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const posthog = getPostHogClient();
    const distinctId = request.headers.get('x-posthog-distinct-id') ?? 'anonymous';
    posthog.capture({
      distinctId,
      event: 'event_detail_viewed',
      properties: {
        event_slug: slug,
        event_title: (event as { title?: string }).title,
        event_location: (event as { location?: string }).location,
        event_date: (event as { date?: string }).date,
        event_mode: (event as { mode?: string }).mode,
      },
    });

    // Return the successfully retrieved event
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    // Log the error for server-side debugging
    console.error(`Error fetching event by slug:`, error);

    // Return a generic error message to the client
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
