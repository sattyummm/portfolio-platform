import { NextResponse } from "next/server";
import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
}

export async function GET() {
  try {
    await dbConnect();
    const data = await Skill.find().sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id, category, items } = await req.json();
    if (id && id.trim() !== "") {
      const updated = await Skill.findByIdAndUpdate(id.trim(), { category, items }, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }
    const created = await Skill.create({ category, items });
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}