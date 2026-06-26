'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    overview: '',
    venue: '',
    location: '',
    date: '',
    time: '',
    mode: 'In-person',
    audience: 'Everyone',
    organizer: '',
    tags: '',
    agenda: '',
    image: '', // Will hold base64 string
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions to prevent huge payloads
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to webp at 80% quality
          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          setFormData(prev => ({ ...prev, image: dataUrl }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format tags and agenda into arrays
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const agendaArray = formData.agenda.split('\n').map(a => a.trim()).filter(Boolean);

      if (!formData.image) {
        throw new Error('Please upload an event cover image.');
      }

      const payload = {
        ...formData,
        tags: tagsArray,
        agenda: agendaArray,
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      // Redirect to the new event page or events list
      router.push('/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-100 border border-dark-200 card-shadow p-8 rounded-xl w-full max-w-4xl mx-auto">
      {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-light-200 font-medium">Event Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required placeholder="e.g. Next.js Conf 2026" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="organizer" className="text-light-200 font-medium">Organizer *</label>
            <input type="text" id="organizer" name="organizer" value={formData.organizer} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required placeholder="e.g. Vercel" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-light-200 font-medium">Date *</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="time" className="text-light-200 font-medium">Time *</label>
            <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="venue" className="text-light-200 font-medium">Venue *</label>
            <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required placeholder="e.g. Moscone Center" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-light-200 font-medium">Location *</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required placeholder="e.g. San Francisco, CA" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="mode" className="text-light-200 font-medium">Event Mode *</label>
            <select id="mode" name="mode" value={formData.mode} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audience" className="text-light-200 font-medium">Target Audience *</label>
            <input type="text" id="audience" name="audience" value={formData.audience} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required placeholder="e.g. Frontend Developers" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-light-200 font-medium">Short Description *</label>
          <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required placeholder="Brief catchphrase or summary" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="overview" className="text-light-200 font-medium">Detailed Overview *</label>
          <textarea id="overview" name="overview" value={formData.overview} onChange={handleChange} rows={5} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white resize-none" required placeholder="Provide a detailed description of the event..." />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="agenda" className="text-light-200 font-medium">Agenda (One item per line) *</label>
          <textarea id="agenda" name="agenda" value={formData.agenda} onChange={handleChange} rows={4} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white resize-none" required placeholder="9:00 AM - Registration&#10;10:00 AM - Keynote&#10;11:00 AM - Networking" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tags" className="text-light-200 font-medium">Tags (Comma separated) *</label>
          <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} className="bg-dark-200 rounded-[6px] px-5 py-3 outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all text-white" required placeholder="e.g. React, Next.js, Web Development" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="text-light-200 font-medium">Cover Image *</label>
          <div className="flex items-center gap-4">
            <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" className="bg-dark-200 rounded-[6px] px-5 py-3 w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/90 transition-all cursor-pointer" required />
          </div>
          {formData.image && (
            <div className="mt-4 rounded-lg overflow-hidden border border-dark-200 h-48 w-full relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="mt-6 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-4 text-lg font-bold text-black transition-all">
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
