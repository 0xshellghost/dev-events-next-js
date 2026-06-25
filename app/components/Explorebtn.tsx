'use client'
import { NextPage } from 'next'
import Image from 'next/image'

interface Props {}

const Explorebtn: NextPage<Props> = ({}) => {
  return (
    <div className="flex justify-center mt-7">
      <button 
        type='button' 
        id="explore-btn"
        className='border-dark-200 bg-dark-100 flex w-fit cursor-pointer rounded-full border px-8 py-3.5 max-sm:w-full text-center hover:bg-dark-200 transition-colors' 
        onClick={()=>console.log('click')}
      >
          <a href="#events" className="flex items-center justify-center gap-2 text-center w-full text-white font-semibold">
              Explore Events
              <Image
              src="/icons/arrow-down.svg"
              alt='arrow-down-icon'
              width={20}
              height={20}
              priority
              />
            </a>
      </button>
    </div>
  )
}

export default Explorebtn