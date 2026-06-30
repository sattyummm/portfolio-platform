import mongoose, { Schema, model, models } from 'mongoose';

const CreativeWorkSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['PHOTOGRAPHY', 'VIDEOGRAPHY', 'VIDEO_EDITING', 'GRAPHIC_DESIGN', 'MUSIC'],
    index: true 
  },
  mediaUrl: { type: String, required: true }, // URL to image/video file
  thumbnailUrl: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false, index: true }
}, { timestamps: true });

export const CreativeWork = models.CreativeWork || model('CreativeWork', CreativeWorkSchema);