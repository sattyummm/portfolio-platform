import { NextResponse } from "next/server";
import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  description: { type: String, default: "" },
  credentialUrl: { type: String, default: "" },
  image: { type: String, default: "" }, // Stores web-optimized image tokens
  createdAt: { type: Date, default: Date.now }
});

const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
}

export async function GET() {
  try {
    await dbConnect();
    const certs = await Certificate.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: certs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newCert = await Certificate.create(body);
    return NextResponse.json({ success: true, data: newCert });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Certificate.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}