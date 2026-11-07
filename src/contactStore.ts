import { useEffect, useState } from "react";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  orderReference: string;
  message: string;
  status: "Open" | "Resolved";
  createdAt: string;
  resolvedAt?: string;
};
export type EnquiryInput = Omit<
  Enquiry,
  "id" | "status" | "createdAt" | "resolvedAt"
>;
export const CONTACT_KEY = "bings-bakery-enquiries-v1";
const CHANGE_EVENT = "bings-bakery-enquiries-changed";

export function loadEnquiries(): Enquiry[] {
  const raw = localStorage.getItem(CONTACT_KEY);
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (
    !Array.isArray(data) ||
    !data.every((item) => {
      if (!item || typeof item !== "object") return false;
      const x = item as Enquiry;
      return (
        [
          x.id,
          x.name,
          x.email,
          x.phone,
          x.topic,
          x.orderReference,
          x.message,
          x.createdAt,
        ].every((v) => typeof v === "string") &&
        ["Open", "Resolved"].includes(x.status) &&
        (x.resolvedAt === undefined || typeof x.resolvedAt === "string")
      );
    })
  )
    throw new Error(
      "The saved enquiry data could not be read. Recover or clear the corrupted browser contact data before saving new messages.",
    );
  return data as Enquiry[];
}

function saveEnquiries(items: Enquiry[]) {
  localStorage.setItem(CONTACT_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function createEnquiry(input: EnquiryInput): Enquiry {
  const clean = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value.trim()]),
  ) as EnquiryInput;
  if (
    !clean.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) ||
    !clean.message ||
    clean.message.length > 4000 ||
    clean.name.length > 100 ||
    clean.email.length > 254 ||
    clean.phone.length > 80 ||
    clean.orderReference.length > 80
  ) {
    throw new Error(
      "Enter your name, a valid email address and a message of up to 4,000 characters.",
    );
  }
  const items = loadEnquiries();
  const duplicate = items.find(
    (item) =>
      item.email.toLowerCase() === clean.email.toLowerCase() &&
      item.message === clean.message &&
      item.topic === clean.topic &&
      Date.now() - Date.parse(item.createdAt) < 60000,
  );
  if (duplicate) return duplicate;
  const enquiry: Enquiry = {
    ...clean,
    id:
      "E-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      crypto.randomUUID().slice(0, 5).toUpperCase(),
    status: "Open",
    createdAt: new Date().toISOString(),
  };
  saveEnquiries([enquiry, ...items]);
  return enquiry;
}

export function setEnquiryStatus(id: string, status: Enquiry["status"]) {
  const items = loadEnquiries();
  if (!items.some((item) => item.id === id))
    throw new Error(
      "This enquiry no longer exists. Refresh the inbox and try again.",
    );
  saveEnquiries(
    items.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            resolvedAt:
              status === "Resolved" ? new Date().toISOString() : undefined,
          }
        : item,
    ),
  );
}

export function useEnquiries() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const refresh = () => {
      try {
        setItems(loadEnquiries());
        setError("");
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Enquiries are unavailable in browser storage.",
        );
      }
    };
    const storage = (e: StorageEvent) => {
      if (e.key === CONTACT_KEY || e.key === null) refresh();
    };
    refresh();
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", storage);
    };
  }, []);
  return { items, error };
}
