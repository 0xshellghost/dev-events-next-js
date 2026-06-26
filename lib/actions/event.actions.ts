'use server';
import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getAllEvents = async () => {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(events));
    } catch {
        return [];
    }
}

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug }).lean();
        return event ? JSON.parse(JSON.stringify(event)) : null;
    } catch {
        return null;
    }
}

export const getSimilarEventsBySlug=async(slug:string)=>{
    try {
        await connectDB();
        const event =await Event.findOne({slug});
        if (!event) return [];
        const similarEvents = await Event.find({_id:{$ne:event._id},tags:{ $in: event.tags}}).lean(); 
        return JSON.parse(JSON.stringify(similarEvents));
    }catch{
        return [];
    }
}

import { revalidatePath } from 'next/cache';

export const deleteEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const deletedEvent = await Event.findOneAndDelete({ slug });
        if (deletedEvent) {
            revalidatePath('/', 'layout');
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error deleting event:", error);
        return false;
    }
}