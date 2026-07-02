import { NextResponse } from "next/server";
import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true },
  score: { type: String, required: true },
  subtitle: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Education = mongoose.models.Education || mongoose.model("Education", EducationSchema);

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
}

export async function GET() {
  try {
    await dbConnect();
    const data = await Education.find().sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id, degree, institution, duration, score, subtitle } = await req.json();
    const payload = { degree, institution, duration, score, subtitle };
    if (id && id.trim() !== "") {
      const updated = await Education.findByIdAndUpdate(id.trim(), payload, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }
    const created = await Education.create(payload);
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Education.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}