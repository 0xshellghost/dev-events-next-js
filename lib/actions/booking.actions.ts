'use server'

import { cacheLife } from "next/cache";
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";


export async function createBooking(eventId: string,slug: string,email: string) {
    'use cache';
    cacheLife('hours');

    try {
        await connectDB();
       const booking=(await Booking.create({
        eventId,slug,email
       })).lean();
       return {
        success:true,
        booking
       };

        
    } catch (error) {
        console.log(error);
        return {
            message:"Error booking event",
        }
    }   
    

}