'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEventBySlug } from '@/lib/actions/event.actions';

interface DeleteEventButtonProps {
    slug: string;
}

export default function DeleteEventButton({ slug }: DeleteEventButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const success = await deleteEventBySlug(slug);
            if (success) {
                alert("Event deleted successfully.");
                router.push('/events');
                router.refresh();
            } else {
                alert("Failed to delete the event.");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error("Deletion error:", error);
            alert("An error occurred while deleting.");
            setIsDeleting(false);
        }
    };

    return (
        <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="mt-4 w-full p-2 bg-red-900/40 text-red-400 border border-red-500/50 font-semibold rounded cursor-pointer hover:bg-red-900/60 transition-all disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete Event"}
        </button>
    );
}
