export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date?: string;
  time?: string;
  location?: string;
  notes?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  type: "product" | "service" | "pricing" | "general";
  itemName?: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit form");
  }

  return response.json();
}

export async function submitBooking(data: BookingFormData) {
  const response = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit booking");
  }

  return response.json();
}

export async function submitInquiry(data: InquiryFormData) {
  const response = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit inquiry");
  }

  return response.json();
}
