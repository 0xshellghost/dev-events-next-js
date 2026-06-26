'use client'
import { NextPage } from 'next'
import Link from 'next/link';
import Image from 'next/image';
import posthog from 'posthog-js';

interface Props {
    title:string;
    image:string;
    slug:string;
    location:string;
    date:string;
    time:string;
}

const EventCard: NextPage<Props> = ({title,image,slug,location,date,time}:Props) => {
  const handleClick = () => {
    posthog.capture('event_card_clicked', {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <Link href={`/events/${slug}`} id="event-card" onClick={handleClick}>
        <Image src={image} alt={title} width={410} height={300} className='poster' style={{ width: '100%', height: 'auto' }}/>
        <div className="flex flex-row gap-2 items-center">
            <Image src="/icons/pin.svg" alt="location-icon" width={14} height={14} priority style={{ width: 'auto', height: 'auto' }}/>
            <p className='text-light-200 text-sm'>{location}</p>
        </div>
        <p className='title'>{title}</p>
        <div className="datetime">
          <div>
            <Image src="/icons/calendar.svg" alt="date-icon" width={14} height={14} priority style={{ width: 'auto', height: 'auto' }}/>
            <p>{date ? new Date(date).toLocaleDateString('en-US') : ''}</p>
          </div>
          <div>
            <Image src="/icons/clock.svg" alt="time-icon" width={14} height={14} priority style={{ width: 'auto', height: 'auto' }}/>
            <p>{time}</p>
          </div>
        </div>
    </Link>
  )
}

export default EventCard