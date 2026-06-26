import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "../../components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/app/components/EventCard";
import { IEvent } from "@/database";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => {
    return (
        <div className="flex-row-gap-2 items-center">
            <Image src={icon} alt={alt} className="icon" width={17} height={17} style={{ width: 'auto', height: 'auto' }} />
            <p className="text-base">{label}</p>
        </div>
    )
}
const bookings = 10;
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
    return (
        <section className="flex-col-gap-2 mt-4">
            <h2>Event Agenda</h2>
            {agendaItems && agendaItems.length > 0 ? (
                <ul className="list-disc list-inside">
                    {agendaItems.map((item) => (
                        <li className="mt-2 text-light-100" key={item}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>No agenda provided.</p>
            )}
        </section>
    )
}

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const SimilarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
    const request = await fetch(`${BASE_URL}/api/events/${slug}`)

    // The API returns the event object directly, not wrapped in an { event: ... } property
    const eventData = await request.json();
    const { description, image, title, date, time, venue, mode, agenda, overview, location, organizer, audience, tags } = eventData;

    if (!description) {
        return notFound();
    }

    // Safely handle agenda which might be an array of strings or a stringified JSON array
    let parsedAgenda = [];
    if (Array.isArray(agenda)) {
        parsedAgenda = typeof agenda[0] === 'string' && agenda[0].startsWith('[') ? JSON.parse(agenda[0]) : agenda;
    }

    return (
        <section id="event">
            <h1 className="text-center font-semibold text-2xl mb-2">Event Details</h1>
            <div className="header">
                <h1>{title}</h1>
                <h1 className="mt-2">Event Description:</h1>
                <p className="mt-2">{description}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image src={image} alt={title} className="banner" width={800} height={800} style={{ width: '100%', height: 'auto' }} />

                    <section className="flex-col-gap-2">
                        <h2>Event Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <div className="grid grid-cols-2 gap-4 mt-2 max-sm:grid-cols-1">
                            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
                            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                            <EventDetailItem icon="/icons/pin.svg" alt="location" label={`${venue}, ${location}`} />
                            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={`Mode: ${mode}`} />
                            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={`Audience: ${audience}`} />
                            <EventDetailItem icon="/icons/pin.svg" alt="organizer" label={`Organizer: ${organizer}`} />
                        </div>
                    </section>

                    <EventAgenda agendaItems={parsedAgenda} />

                    {tags && tags.length > 0 && (
                        <section className="flex-col-gap-2 mt-4">
                            <h2>Tags</h2>
                            <div className="flex flex-row flex-wrap gap-2 mt-2">
                                {tags.map((tag: string) => (
                                    <span key={tag} className="pill">{tag}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot Now</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join {bookings} other developers who have already booked their spot.
                            </p>
                        ) : (
                            <p className="text-sm">
                                The Event is offline.
                            </p>
                        )}
                        <BookEvent eventId={eventData._id} />
                    </div>
                </aside>
            </div>
            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div>
                    {SimilarEvents.length > 0 ? SimilarEvents.map((SimilarEvent: IEvent) => (
                        <EventCard key={String(SimilarEvent._id)}{...SimilarEvent} />
                    )) : <p>No Similar Events</p>}
                </div>
            </div>
        </section>
    )
}

export default EventDetailsPage