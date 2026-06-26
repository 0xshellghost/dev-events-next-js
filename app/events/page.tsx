import { cacheLife } from 'next/cache';
import EventCard from '../components/EventCard';
import { IEvent } from '@/database';

import { getAllEvents } from '@/lib/actions/event.actions';

const EventsPage = async () => {
  'use cache';
  cacheLife('hours');
  
  const events: IEvent[] = await getAllEvents();
  
  if (!events) {
    return (
      <section className="mt-20">
        <h1 className="text-center font-semibold text-2xl">All Events</h1>
        <p className="text-center mt-5 text-red-400">Failed to load events. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="mt-10 mb-20">
      <h1 className="text-center font-semibold text-3xl mb-4">Explore All Events</h1>
      <p className="text-center text-light-200 mb-10 max-w-2xl mx-auto">
        Discover the latest hackathons, meetups, and developer conferences happening around the world.
      </p>
      
      {events && events.length > 0 ? (
        <ul className="events grid md:grid-cols-3 gap-10 sm:grid-cols-2 grid-cols-1 list-none">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-dark-200 rounded-lg border border-dark-200">
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-light-200">There are currently no events to display. Check back later!</p>
        </div>
      )}
    </section>
  );
};

export default EventsPage;
