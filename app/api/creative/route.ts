import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { CreativeWork } from '@/models/CreativeWork';

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment connection key.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

// 🔍 1. FETCH ASSETS BY CATEGORY
export const GET = async (request: Request) => {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const assets = await CreativeWork.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: assets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};

// 🚀 2. PUBLISH NEW CREATIVE ASSET
export const POST = async (request: Request) => {
  try {
    await connectToDatabase();
    
    // Core administrative session token gate check
    const cookieJar = await cookies();
    const adminSession = cookieJar.get("admin_session")?.value;
    
    if (!adminSession || adminSession !== process.env.ADMIN_PASS_TOKEN) {
      return NextResponse.json({ success: false, error: "Unauthorized access configuration." }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, mediaUrl, thumbnailUrl, isFeatured } = body;

    if (!title || !description || !category || !mediaUrl) {
      return NextResponse.json({ 
        success: false, 
        error: "Title, description, category, and mediaUrl are strictly required." 
      }, { status: 400 });
    }

    const newAsset = await CreativeWork.create({
      title,
      description,
      category, 
      mediaUrl,
      thumbnailUrl: thumbnailUrl || '',
      isFeatured: Boolean(isFeatured)
    });

    return NextResponse.json({ success: true, data: newAsset }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};