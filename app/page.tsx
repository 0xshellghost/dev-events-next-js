import { cacheLife } from 'next/cache';
import EventCard from './components/EventCard'
import Explorebtn from './components/Explorebtn'
import { IEvent } from '@/database'

const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

const Page = async() => {
  'use cache';
  cacheLife('hours')
  const response=await fetch(`${BASE_URL}/api/events`);
  
  // The API returns an array directly, not an object with an 'events' property
  const events: IEvent[] = await response.json();

  return (
    <section>
      <h1 className='text-center'>The Hub for Every Dev Event<br/>Event You Can't Miss!</h1>
      <p className='text-center mt-5'>Hackathons,Meetups, and Conferences, All in one place</p>
      <Explorebtn/>
      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        <ul className='events grid md:grid-cols-3 gap-10 sm:grid-cols-2 grid-cols-1 list-none'>
          {events.map((event)=>(
            <li key={event.title}><EventCard {...event}/></li>
          ))}
        </ul>
      </div>
      
    </section>
  )
}

export default Page