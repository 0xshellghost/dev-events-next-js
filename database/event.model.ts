import { Schema, model, models, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true },
    audience: { type: String, required: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for validation, slug generation, and data normalization
EventSchema.pre('save', function () {
  // Validate required string fields are present and non-empty
  const stringFields = [
    'title', 'description', 'overview', 'image', 'venue', 
    'location', 'date', 'time', 'mode', 'audience', 'organizer'
  ];
  
  for (const field of stringFields) {
    const value = this.get(field);
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new Error(`Validation Error: ${field} is required and cannot be empty.`);
    }
  }

  // Validate array fields are not empty
  if (!this.agenda || this.agenda.length === 0) {
    throw new Error('Validation Error: agenda cannot be empty.');
  }
  if (!this.tags || this.tags.length === 0) {
    throw new Error('Validation Error: tags cannot be empty.');
  }

  // Generate URL-friendly slug from title if modified
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/(^-|-$)+/g, ''); // Remove leading or trailing hyphens
  }

  // Normalize date to ISO format
  if (this.isModified('date')) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Validation Error: Invalid date format.');
    }
    this.date = parsedDate.toISOString();
  }

  // Normalize time to a consistent format (trimmed and uppercase)
  if (this.isModified('time')) {
    this.time = this.time.trim().toUpperCase();
  }
});

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;