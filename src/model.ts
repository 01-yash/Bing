export type Status =
  | "Awaiting Review"
  | "Needs Clarification"
  | "Awaiting Approval"
  | "Confirmed"
  | "In Production"
  | "Ready"
  | "Picked Up"
  | "Canceled";
export type Quote = {
  version: number;
  base: number;
  extras: number;
  materials: number;
  labor: number;
  delivery: number;
  discount: number;
  tax: number;
  cost: number;
  total: number;
  sent: string;
  approved?: string;
  design: string;
};
export type Order = {
  id: string;
  token: string;
  name: string;
  phone: string;
  email: string;
  contact: string;
  source: string;
  occasion: string;
  date: string;
  time: string;
  servings: string;
  type: string;
  size: string;
  flavor: string;
  filling: string;
  frosting: string;
  colors: string;
  shape: string;
  inscription: string;
  dietary: string;
  description: string;
  status: Status;
  payment: string;
  deposit: number;
  prep: string;
  created: string;
  confirmed?: string;
  approvedDesign?: string;
  image?: string;
  markers: { x: number; y: number; note: string }[];
  quotes: Quote[];
  messages: { author: string; text: string; private: boolean; at: string }[];
  events: {
    text: string;
    at: string;
    actor: string;
    previous_value?: Record<string, unknown>;
    new_value?: Record<string, unknown>;
  }[];
  revision?: string;
  followUp: boolean;
  entrySeconds?: number;
};
export type Settings = {
  flavors: string;
  fillings: string;
  types: string;
  closed: string;
  capacity: number;
  deposit: number;
  expiry: number;
  open: string;
  close: string;
  saturdayClose: string;
  sundayClosed: boolean;
  classicPrice: number;
  staff: string;
  emailTemplate: string;
};
export type DB = {
  orders: Order[];
  settings: Settings;
  incidents: { type: string; note: string; at: string }[];
};
export const key = "cakedesk-demo-v1";
export const day = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const stamp = () => new Date().toISOString();
export const blank = (): Order => ({
  id: "",
  token: "",
  name: "",
  phone: "",
  email: "",
  contact: "Phone",
  source: "ONLINE",
  occasion: "Birthday",
  date: day(2),
  time: "10:00",
  servings: "12",
  type: "Classic celebration",
  size: "8 inch",
  flavor: "Chocolate",
  filling: "Vanilla buttercream",
  frosting: "Buttercream",
  colors: "",
  shape: "Round",
  inscription: "",
  dietary: "",
  description: "",
  status: "Awaiting Review",
  payment: "Unverified",
  deposit: 0,
  prep: day(1),
  created: stamp(),
  markers: [],
  quotes: [],
  messages: [],
  events: [],
  followUp: false,
});
const sampleReference =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="600" height="380" fill="#efe5dc"/><ellipse cx="300" cy="300" rx="180" ry="26" fill="#d5c5b2"/><path d="M165 150v120c0 48 270 48 270 0V150" fill="#faf1db"/><ellipse cx="300" cy="150" rx="135" ry="43" fill="#fff8e8"/><g fill="#a9606a" stroke="#d8a8ab" stroke-width="7"><circle cx="185" cy="141" r="20"/><circle cx="211" cy="117" r="24"/><circle cx="245" cy="110" r="18"/><circle cx="416" cy="154" r="24"/><circle cx="426" cy="191" r="19"/></g><path d="M173 113q-25-35-31-2q22 23 31 2M432 226q32-35 40-8q-21 23-40 8" fill="#86916f"/><text x="300" y="232" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="24" fill="#9b7760">a garden celebration</text><text x="300" y="355" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#8a7662">FICTIONAL DESIGN REFERENCE · ILLUSTRATION</text></svg>`,
  );
export function seed(): DB {
  const make = (
    i: number,
    name: string,
    description: string,
    status: Status,
    offset: number,
    type = "Classic celebration",
  ): Order => ({
    ...blank(),
    id: `B-${1042 + i}`,
    token: crypto.randomUUID(),
    name,
    phone: "302-555-01" + (10 + i),
    email: `sample${i}@example.com`,
    description,
    status,
    date: day(offset),
    prep: day(offset - 1),
    type,
    image: i === 1 ? sampleReference : undefined,
    markers:
      i === 1
        ? [{ x: 34, y: 32, note: "Please make these flowers blue." }]
        : [],
    confirmed: ["Confirmed", "In Production", "Ready", "Picked Up"].includes(
      status,
    )
      ? stamp()
      : undefined,
    approvedDesign: [
      "Confirmed",
      "In Production",
      "Ready",
      "Picked Up",
    ].includes(status)
      ? description
      : undefined,
    payment: i === 0 ? "Verified deposit" : "Unverified",
    deposit: i === 0 ? 20 : 0,
    quotes:
      i === 0
        ? [
            {
              version: 1,
              base: 48,
              extras: 0,
              materials: 0,
              labor: 0,
              delivery: 0,
              discount: 0,
              tax: 0,
              cost: 20,
              total: 48,
              sent: stamp(),
              approved: stamp(),
              design: description,
            },
          ]
        : [],
    events: [
      {
        text: "Fictional sample order created",
        at: stamp(),
        actor: "Demo Manager",
      },
    ],
  });
  return {
    orders: [
      make(0, "Jamie Parker", "Classic birthday cake", "Confirmed", 0),
      make(
        1,
        "Morgan Ellis",
        "Garden party floral cake",
        "Awaiting Review",
        2,
        "Custom design",
      ),
      make(2, "Taylor Reed", "Chocolate celebration cake", "In Production", 0),
      make(3, "Alex Quinn", "Lemon anniversary cake", "Ready", 2),
      make(4, "Sam Rivera", "Graduation sheet cake", "Needs Clarification", 3),
    ],
    settings: {
      flavors: "Chocolate, Lemon, Marble, Red Velvet, Strawberry, Yellow",
      fillings: "Vanilla buttercream, Chocolate ganache, Lemon curd",
      types: "Classic celebration, Custom design, Wedding, Sheet cake",
      closed: "",
      capacity: 0,
      deposit: 0,
      expiry: 7,
      open: "07:00",
      close: "18:00",
      saturdayClose: "17:00",
      sundayClosed: true,
      classicPrice: 48,
      staff: "Demo Owner, Demo Manager, Demo Counter, Demo Baker",
      emailTemplate:
        "Your CakeDesk request has an update. Please review your order link.",
    },
    incidents: [],
  };
}
export function load(): DB {
  const raw = localStorage.getItem(key);
  if (!raw) {
    const initial = seed();
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  const d = JSON.parse(raw);
  if (!validDB(d)) throw Error("Invalid saved data");
  return d;
}
export function validDB(value: unknown): value is DB {
  const d = value as DB;
  const strings = (v: unknown) => typeof v === "string";
  const finite = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  try {
    return (
      !!d &&
      Array.isArray(d.orders) &&
      Array.isArray(d.incidents) &&
      !!d.settings &&
      [
        "flavors",
        "fillings",
        "types",
        "closed",
        "open",
        "close",
        "saturdayClose",
        "staff",
        "emailTemplate",
      ].every((k) => strings(d.settings[k as keyof Settings])) &&
      [d.settings.capacity, d.settings.deposit, d.settings.classicPrice].every(
        (v) => finite(v) && v >= 0,
      ) &&
      finite(d.settings.expiry) &&
      d.settings.expiry >= 1 &&
      typeof d.settings.sundayClosed === "boolean" &&
      new Set(d.orders.map((o) => o.id)).size === d.orders.length &&
      new Set(d.orders.map((o) => o.token)).size === d.orders.length &&
      d.orders.every(
        (o) =>
          !!o &&
          !!o.id &&
          !!o.token &&
          [
            "id",
            "token",
            "name",
            "phone",
            "email",
            "contact",
            "source",
            "occasion",
            "date",
            "time",
            "servings",
            "type",
            "size",
            "flavor",
            "filling",
            "frosting",
            "colors",
            "shape",
            "inscription",
            "dietary",
            "description",
            "payment",
            "prep",
            "created",
          ].every((k) => strings(o[k as keyof Order])) &&
          [
            "Awaiting Review",
            "Needs Clarification",
            "Awaiting Approval",
            "Confirmed",
            "In Production",
            "Ready",
            "Picked Up",
            "Canceled",
          ].includes(o.status) &&
          finite(o.deposit) &&
          o.deposit >= 0 &&
          typeof o.followUp === "boolean" &&
          (o.image === undefined ||
            (typeof o.image === "string" &&
              /^data:image\/(png|jpeg|webp|svg\+xml)[;,]/.test(o.image))) &&
          [o.confirmed, o.approvedDesign, o.revision].every(
            (v) => v === undefined || strings(v),
          ) &&
          Array.isArray(o.markers) &&
          o.markers.every(
            (m) =>
              finite(m.x) &&
              finite(m.y) &&
              m.x >= 0 &&
              m.x <= 100 &&
              m.y >= 0 &&
              m.y <= 100 &&
              strings(m.note),
          ) &&
          Array.isArray(o.quotes) &&
          o.quotes.every(
            (q) =>
              [
                q.base,
                q.extras,
                q.materials,
                q.labor,
                q.delivery,
                q.discount,
                q.tax,
                q.cost,
                q.total,
                q.version,
              ].every(finite) &&
              strings(q.sent) &&
              strings(q.design) &&
              (q.approved === undefined || strings(q.approved)),
          ) &&
          Array.isArray(o.messages) &&
          o.messages.every(
            (m) =>
              strings(m.author) &&
              strings(m.text) &&
              strings(m.at) &&
              typeof m.private === "boolean",
          ) &&
          Array.isArray(o.events) &&
          o.events.every(
            (e) => strings(e.text) && strings(e.at) && strings(e.actor),
          ),
      ) &&
      d.incidents.every(
        (i) => strings(i.type) && strings(i.note) && strings(i.at),
      )
    );
  } catch {
    return false;
  }
}
export const committed = (o: Order) =>
  ["Confirmed", "In Production", "Ready", "Picked Up"].includes(o.status);
export function unavailable(
  date: string,
  time: string,
  db: DB,
  exclude?: string,
) {
  const weekday = new Date(date + "T12:00:00").getDay();
  if (date < day()) return "Pickup dates must be today or later.";
  if (
    db.settings.closed
      .split(",")
      .map((x) => x.trim())
      .includes(date) ||
    (weekday === 0 && db.settings.sundayClosed)
  )
    return "The bakery is closed on this date. Choose another date or ask staff for an override.";
  if (
    time < db.settings.open ||
    time > (weekday === 6 ? db.settings.saturdayClose : db.settings.close)
  )
    return "Choose a pickup time within the bakery’s opening hours.";
  if (
    db.settings.capacity > 0 &&
    db.orders.filter(
      (o) =>
        o.id !== exclude &&
        o.date === date &&
        committed(o) &&
        o.status !== "Picked Up",
    ).length >= db.settings.capacity
  )
    return "This date is at its configured capacity. Staff review is required.";
  return "";
}
export function issue(order: Order, actor: string): Order {
  return {
    ...order,
    id:
      "B-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      crypto.randomUUID().slice(0, 6).toUpperCase(),
    token: crypto.randomUUID(),
    created: stamp(),
    events: [
      { text: "Order received — awaiting bakery review", at: stamp(), actor },
    ],
  };
}
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
export function download(
  name: string,
  body: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function csv(orders: Order[]) {
  const rows = [
    [
      "Reference",
      "Customer",
      "Source",
      "Pickup date",
      "Time",
      "Cake",
      "Status",
      "Payment",
    ],
    ...orders.map((o) => [
      o.id,
      o.name,
      o.source,
      o.date,
      o.time,
      o.description,
      o.status,
      o.payment,
    ]),
  ];
  return rows
    .map((r) =>
      r
        .map(
          (c) =>
            '"' +
            (/^[=+@\t\r-]/.test(String(c)) ? "'" : "") +
            String(c).replaceAll('"', '""') +
            '"',
        )
        .join(","),
    )
    .join("\r\n");
}
