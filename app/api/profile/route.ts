import { NextResponse } from "next/server";
import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: "Satyam Kumar" },
  titles: { type: String, default: "Software Engineer • Creator • Musician" },
  phone: { type: String, default: "" },
  instagram: { type: String, default: "" },
  profilePicUrl: { type: String, default: "" },
  bannerUrl: { type: String, default: "" },
});

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
}

export async function GET() {
  try {
    await dbConnect();
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const titles = formData.get("titles") as string;
    const phone = formData.get("phone") as string;
    const instagram = formData.get("instagram") as string;
    const avatarBase64 = formData.get("profilePicUrl") as string;
    const bannerBase64 = formData.get("bannerUrl") as string;

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile({});

    profile.name = name;
    profile.titles = titles;
    profile.phone = phone;
    profile.instagram = instagram;
    
    // Only overwrite images if a new file string was uploaded
    if (avatarBase64) profile.profilePicUrl = avatarBase64;
    if (bannerBase64) profile.bannerUrl = bannerBase64;

    await profile.save();
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}