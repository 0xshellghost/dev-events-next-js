import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
interface Props {}

const Navbar: NextPage<Props> = ({}) => {
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
                <Link href="/create-event">Create Event</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar