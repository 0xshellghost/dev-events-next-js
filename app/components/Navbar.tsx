'use client'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import posthog from 'posthog-js'

type Props = object;

const Navbar: NextPage<Props> = ({}) => {
  const handleCreateEventClick = () => {
    posthog.capture('create_event_nav_clicked');
  };

  return(
    <header>
        <nav>
            <Link href='/' className="logo">
               <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
                <p>DevEvent</p>
            </Link>
            <ul className='nav-links'>
                <Link href="/">Home</Link>
                <Link href="/events">Events</Link>
                <Link href="/create-event" onClick={handleCreateEventClick}>Create Event</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar