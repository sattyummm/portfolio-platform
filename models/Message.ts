import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 } // ⭐ Recruiter star rating score
}, { timestamps: true });

export const Message = models.Message || model('Message', MessageSchema);