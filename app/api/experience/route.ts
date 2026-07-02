import { NextResponse } from "next/server";
import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  bullets: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Experience = mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
}

export async function GET() {
  try {
    await dbConnect();
    const data = await Experience.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id, role, company, duration, bullets } = await req.json();
    const payload = { role, company, duration, bullets };
    if (id && id.trim() !== "") {
      const updated = await Experience.findByIdAndUpdate(id.trim(), payload, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }
    const created = await Experience.create(payload);
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}