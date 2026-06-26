import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Event, IEvent } from '@/database';
import { getPostHogClient } from '@/lib/posthog-server';

// Next.js 15+ dynamic route parameters are asynchronous
interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/events/[slug]
 * Retrieves the details of a specific event by its slug.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Await params as required by Next.js 15 App Router
    const { slug } = await params;

    // Validate the presence of the slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request: Missing or invalid slug parameter.' },
        { status: 400 }
      );
    }

    // Ensure connection to MongoDB
    await connectToDatabase();

    // Query the database for the specific event
    // .lean() improves performance by returning a POJO (Plain Old JavaScript Object)
    const event = await Event.findOne({ slug }).lean() as IEvent | null;

    // Handle the case where the event does not exist
    if (!event) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: 'anonymous',
        event: 'event_not_found',
        properties: { slug },
      });
      
      return NextResponse.json(
        { error: `Not Found: No event found with slug '${slug}'.` },
        { status: 404 }
      );
    }

    // Track successful event view via PostHog
    const posthog = getPostHogClient();
    const distinctId = request.headers.get('x-posthog-distinct-id') || 'anonymous';
    
    posthog.capture({
      distinctId,
      event: 'event_detail_viewed',
      properties: {
        event_slug: slug,
        event_title: event.title,
        event_location: event.location,
        event_date: event.date,
        event_mode: event.mode,
      },
    });

    // Return the event data successfully
    return NextResponse.json(event, { status: 200 });
    
  } catch (error) {
    // Log the error for server-side debugging
    console.error('[API Error] Fetching event by slug failed:', error);

    // Return a standardized 500 internal server error response
    return NextResponse.json(
      { error: 'Internal Server Error: An unexpected error occurred while fetching the event.' },
      { status: 500 }
    );
  }
}
