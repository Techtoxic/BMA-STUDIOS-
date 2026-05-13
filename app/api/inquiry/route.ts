import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  type: z.enum(["product", "service", "pricing", "general"]),
  itemName: z.string().optional(),
  message: z.string().min(5, "Please provide more details"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = inquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid inquiry data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, type, itemName, message } = result.data;

    console.log("New inquiry:", {
      name,
      email,
      phone,
      type,
      itemName,
      message,
      timestamp: new Date().toISOString(),
    });

    const inquiryMessage = encodeURIComponent(
      `New Inquiry\n\nType: ${type}${itemName ? `\nItem: ${itemName}` : ""}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nMessage: ${message}`
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your inquiry! We will respond shortly.",
        whatsappUrl: `https://wa.me/254725297393?text=${inquiryMessage}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
