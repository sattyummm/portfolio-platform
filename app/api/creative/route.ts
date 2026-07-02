import { NextResponse } from "next/server";
import mongoose from "mongoose";

const CreativeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Creative = mongoose.models.Creative || mongoose.model("Creative", CreativeSchema);

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
}

const formatEmbedUrl = (rawUrl: string): string => {
  const url = rawUrl.trim();
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";
    if (url.includes("v=")) {
      const match = url.match(/[?&]v=([^&#]+)/);
      videoId = match ? match[1] : "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
    } else if (url.includes("/shorts/")) {
      const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      videoId = match ? match[1] : "";
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("instagram.com")) {
    const postMatch = url.match(/\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    if (postMatch && postMatch[2]) return `https://www.instagram.com/p/${postMatch[2]}/embed/`;
  }
  return url;
};

export async function GET() {
  try {
    await dbConnect();
    const assets = await Creative.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: assets });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, title, description, category, mediaUrl } = body;
    const optimizedUrl = formatEmbedUrl(mediaUrl);
    const payload = { title, description, category, mediaUrl: optimizedUrl };

    if (id && id.trim() !== "") {
      const updatedAsset = await Creative.findByIdAndUpdate(id.trim(), payload, { new: true });
      return NextResponse.json({ success: true, data: updatedAsset });
    }
    const newAsset = await Creative.create(payload);
    return NextResponse.json({ success: true, data: newAsset });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Creative.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}