'use client'
import {useState,useEffect} from "react"

const BookEvent=({ eventId }: { eventId: string })=>{
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [booked,setBooked]=useState(false);
    const [submitted,setSubmitted]=useState(false);
    const [error, setError]=useState("");

    const handleBookEvent=async(e: React.FormEvent)=>{
        e.preventDefault();
        setError("");

        if(booked || !email || !name){
            setError("Please fill out all fields.");
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, eventId })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to book event.");
            }

            setSubmitted(true);
            setBooked(true);
        } catch(err:any){
            setError(err.message);
        }
    }

    return(
        <div id="book-event" className="mt-4">
            {submitted?(
                <div className="flex-col-gap-2">
                    <h2 className="text-green-400 font-semibold text-lg">Thank you for booking your spot!</h2>
                    <p className="text-sm">We have sent a confirmation to {email}.</p>
                </div>
            ):(
                <form onSubmit={handleBookEvent} className="flex flex-col gap-4">
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)} className="p-2 border border-dark-200 bg-dark-200 rounded text-white" required placeholder="John Doe"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="p-2 border border-dark-200 bg-dark-200 rounded text-white" required placeholder="john@example.com"/>
                    </div>
                    <button type="submit" className="button-submit mt-2 w-full p-2 bg-primary text-black font-semibold rounded cursor-pointer hover:bg-primary/90 transition-all">
                        Confirm Registration
                    </button>
                </form>
            )}
        </div>
    )
}
export default BookEvent