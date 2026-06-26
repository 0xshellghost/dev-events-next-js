import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true, 
      index: true 
    },
    email: { 
      type: String, 
      required: true, 
      trim: true,
      lowercase: true,
      // Regex validation for proper email formatting
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to verify that the referenced Event exists
BookingSchema.pre('save', async function () {
  const eventExists = await Event.findById(this.eventId);
  if (!eventExists) {
    throw new Error(`Validation Error: Event with ID ${this.eventId} does not exist.`);
  }
});

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
