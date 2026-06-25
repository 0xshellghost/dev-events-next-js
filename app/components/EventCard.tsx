import { NextPage } from 'next'
import Link from 'next/link';
import Image from 'next/image';
interface Props {
    title:string;
    image:string;
    slug:string;
    location:string;
    date:string;
    time:string;
}

const EventCard: NextPage<Props> = ({title,image,slug,location,date,time}:Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
        <Image src={image} alt={title} width={410} height={300} className='poster'/>
        <div className="flex flex-row gap-2 items-center">
            <Image src="/icons/pin.svg" alt="location-icon" width={14} height={14} priority/>
            <p className='text-light-200 text-sm'>{location}</p>
        </div>
        <p className='title'>{title}</p>
        <div className="datetime">
          <div>
            <Image src="/icons/calendar.svg" alt="date-icon" width={14} height={14} priority/>
            <p>{date}</p>
          </div>
          <div>
            <Image src="/icons/clock.svg" alt="time-icon" width={14} height={14} priority/>
            <p>{time}</p>
          </div>
        </div>
    </Link>
  )
}

export default EventCard