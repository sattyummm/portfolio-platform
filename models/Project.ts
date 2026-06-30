import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  techStack: [{ type: String, index: true }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  coverImage: { type: String, required: true },
  isFeatured: { type: Boolean, default: false, index: true },
  category: { type: String, default: 'SOFTWARE', immutable: true }
}, { timestamps: true });

export const Project = models.Project || model('Project', ProjectSchema);