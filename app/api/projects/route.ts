import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Project } from '@/models/Project'; // Adjust path if your model file is located elsewhere

// Global active connection verification handler
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment connection key.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

// 🔍 1. FETCH ROUTE PIPELINE (Fixes the 405 Error)
export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve projects" },
      { status: 500 }
    );
  }
}

// 🚀 2. SUBMIT ROUTE PIPELINE (Your working logic)
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // De-structure inputs matching your model parameters
    const { title, description, techStack, githubUrl } = body;

    const newProject = await Project.create({
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : [],
      githubUrl: githubUrl || '',
      coverImage: '', // Explicitly passing empty string to pass schema check safely
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error: any) {
    console.error("DETAILED MONGODB ERROR:", error);
    return NextResponse.json(
      { success: false, message: `Database Failure: ${error.message || error}` },
      { status: 500 }
    );
  }
}