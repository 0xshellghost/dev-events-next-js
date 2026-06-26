import CreateEventForm from '../components/CreateEventForm';

export default function CreateEventPage() {
  return (
    <section className="mt-10 mb-20">
      <div className="text-center mb-10">
        <h1 className="font-semibold text-3xl mb-4">Host a New Event</h1>
        <p className="text-light-200 max-w-2xl mx-auto">
          Share your upcoming hackathon, meetup, or conference with the developer community. Fill out the details below to get started.
        </p>
      </div>
      
      <CreateEventForm />
    </section>
  );
}
