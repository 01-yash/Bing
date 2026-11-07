import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  MessageSquare,
  CalendarDays,
  ChartNoAxesCombined,
  Settings as SettingsIcon,
  ChefHat,
  ArrowUpRight,
  ArrowRight,
  Search,
  Clock,
  Check,
  Printer,
  Download,
  Flower2,
  Menu,
  X,
  ChevronRight,
  Phone,
  ShieldCheck,
  Sun,
} from "lucide-react";
import {
  type DB,
  type Order,
  type Quote,
  type Status,
  blank,
  seed,
  load,
  key,
  day,
  stamp,
  committed,
  unavailable,
  issue,
  money,
  download,
  csv,
  validDB,
} from "./model";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/eb-garamond/latin-400.css";
import "@fontsource/eb-garamond/latin-500.css";
import "./style.css";
type Context = {
  db: DB;
  save: (db: DB) => boolean;
  update: (o: Order, text: string) => boolean;
  role: string;
  setRole: (v: string) => void;
  notice: (v: string) => void;
};
const C = createContext<Context>(null!);
const useApp = () => useContext(C);
const statusClass = (s: string) => s.toLowerCase().replaceAll(" ", "-");
function Badge({ status }: { status: string }) {
  return (
    <span className={"badge " + statusClass(status)}>
      <i />
      {status}
    </span>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Empty({ text = "Nothing here yet." }: { text?: string }) {
  return (
    <div className="empty">
      <ChefHat size={30} />
      <h3>A little room to breathe.</h3>
      <p>{text}</p>
    </div>
  );
}
function App() {
  const [initial] = useState(() => {
    try {
      return { db: load(), error: "" };
    } catch {
      return {
        db: seed(),
        error:
          "Saved data could not be read. Export or recover your browser data before saving new orders.",
      };
    }
  });
  const [db, setDB] = useState(initial.db);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const next = JSON.parse(e.newValue);
          if (validDB(next)) setDB(next);
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const [toast, setToast] = useState(initial.error);
  const [role, setRoleState] = useState(
    sessionStorage.getItem("cake-role") || "",
  );
  const notice = (v: string) => {
    setToast(v);
    setTimeout(() => setToast(""), 7000);
  };
  const save = (next: DB) => {
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setDB(next);
      return true;
    } catch {
      notice(
        "Could not save. Browser storage may be full. Export your data and try again.",
      );
      return false;
    }
  };
  const update = (o: Order, text: string) =>
    save({
      ...db,
      orders: db.orders.map((x) =>
        x.id === o.id
          ? {
              ...o,
              events: [
                ...o.events,
                {
                  text,
                  at: stamp(),
                  actor: window.location.pathname.startsWith("/request/")
                    ? "Customer"
                    : "Demo " + role,
                  previous_value: Object.fromEntries(
                    (
                      [
                        "status",
                        "payment",
                        "deposit",
                        "date",
                        "time",
                        "prep",
                        "description",
                        "approvedDesign",
                        "revision",
                        "followUp",
                      ] as const
                    )
                      .filter((k) => x[k] !== o[k])
                      .map((k) => [k, x[k] ?? null]),
                  ),
                  new_value: Object.fromEntries(
                    (
                      [
                        "status",
                        "payment",
                        "deposit",
                        "date",
                        "time",
                        "prep",
                        "description",
                        "approvedDesign",
                        "revision",
                        "followUp",
                      ] as const
                    )
                      .filter((k) => x[k] !== o[k])
                      .map((k) => [k, o[k] ?? null]),
                  ),
                },
              ],
            }
          : x,
      ),
    });
  const setRole = (v: string) => {
    setRoleState(v);
    sessionStorage.setItem("cake-role", v);
  };
  return (
    <C.Provider value={{ db, save, update, role, setRole, notice }}>
      <BrowserRouter>
        <div className="demo-strip">
          <span>
            <i /> COMPETITION DEMONSTRATION
          </span>
          <span>
            Fictional orders · saved on this browser only{" "}
            <Link to="/demo">
              Explore the demo <ArrowUpRight size={12} />
            </Link>
          </span>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Wizard />} />
          <Route path="/order/confirmation" element={<Confirmation />} />
          <Route path="/request/:token" element={<Customer />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/staff/login" element={<Login />} />
          <Route path="/staff/*" element={<Staff />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {toast && (
          <div className="toast" role="status">
            {toast}
            <button
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </BrowserRouter>
    </C.Provider>
  );
}
function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-icon">
        <ChefHat size={25} />
      </span>
      <span>
        Bing’s <b>CakeDesk</b>
        <small>A LITTLE CARE IN EVERY ORDER</small>
      </span>
    </Link>
  );
}
function PublicHeader() {
  return (
    <header className="public-header">
      <Brand />
      <nav>
        <a href="/#cakes">Custom cakes</a>
        <a href="/#how">How it works</a>
        <a href="/#contact">Contact</a>
        <Link className="button small" to="/order">
          Start a cake order <ArrowUpRight size={15} />
        </Link>
      </nav>
    </header>
  );
}
function CakeArt({ floral = false }: { floral?: boolean }) {
  return (
    <div
      className={"cake-art " + (floral ? "floral" : "")}
      aria-label={
        floral
          ? "Illustration of a floral celebration cake"
          : "Illustration of a classic layered cake"
      }
      role="img"
    >
      <div className="cake-shadow" />
      <div className="cake-plate" />
      <div className="cake-body">
        <span className="icing" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <i className={"rosette r" + i} key={i}>
            {floral ? <Flower2 size={35} /> : null}
          </i>
        ))}
        <div className="cake-writing">
          {floral ? "with love" : "make a wish"}
        </div>
      </div>
      <div className="cake-top" />
      {!floral && <div className="candles">✦ &nbsp; ✦ &nbsp; ✦</div>}
      <span className="art-caption">AN IDEA TO MAKE YOUR OWN</span>
    </div>
  );
}
function Home() {
  return (
    <>
      <PublicHeader />
      <main className="home">
        <div className="hero">
          <div>
            <p className="eyebrow">BING’S BAKERY · NEWARK, DELAWARE</p>
            <h1>
              Have a cake
              <br />
              in mind<span>?</span>
            </h1>
            <p className="hero-copy">
              Every celebration starts with an idea. Choose your cake, share
              your inspiration, and let our team take care of the details.
            </p>
            <Link className="button" to="/order">
              Start your cake <ArrowRight size={17} />
            </Link>
            <p className="quiet">
              No account needed. A real baker reviews every request.
            </p>
          </div>
          <div className="hero-art">
            <CakeArt floral />
            <span className="hero-label">Your idea. Our craft.</span>
          </div>
        </div>
        <section id="cakes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LET’S MAKE IT YOURS</p>
              <h2>Two ways to something wonderful.</h2>
            </div>
            <p>
              Simple favorites or a one-of-a-kind idea.
              <br />
              There’s a place to start for every celebration.
            </p>
          </div>
          <div className="choice-grid">
            <Link to="/order?kind=classic" className="choice">
              <CakeArt />
              <div>
                <span className="eyebrow">THE FAMILIAR FAVORITES</span>
                <h2>A classic cake</h2>
                <p>
                  Choose your flavors, add a message, and make a favorite your
                  own. Example pricing, reviewed by our team.
                </p>
                <strong>
                  Choose your cake <ArrowRight size={18} />
                </strong>
              </div>
            </Link>
            <Link to="/order?kind=custom" className="choice">
              <CakeArt floral />
              <div>
                <span className="eyebrow">A LITTLE MORE YOU</span>
                <h2>Something custom</h2>
                <p>
                  A photo, a color palette, a very particular idea. Share your
                  inspiration and we’ll work out the possibilities together.
                </p>
                <strong>
                  Request a custom cake <ArrowRight size={18} />
                </strong>
              </div>
            </Link>
          </div>
        </section>
        <section id="how" className="how">
          <p className="eyebrow">FROM FIRST IDEA TO FIRST SLICE</p>
          <h2>Thoughtfully made. Simply ordered.</h2>
          <div className="three">
            {[
              [
                "01",
                "Tell us about your cake",
                "The occasion, the flavors, the details that matter. Add a reference photo if you have one.",
              ],
              [
                "02",
                "Let’s get the details right",
                "Our team reviews your design and sends a quote. You approve it before we confirm.",
              ],
              [
                "03",
                "We’ll see you at pickup",
                "Your approved design and confirmed pickup stay together, all the way to the counter.",
              ],
            ].map(([n, t, p]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer id="contact">
        <Brand />
        <p>
          253 East Main Street · Newark, DE 19711
          <br />
          <a href="tel:3027375310">302-737-5310</a> · Mon–Fri 7–6 · Sat 7–5 ·
          Sun closed
        </p>
        <p>
          Requests are subject to bakery approval.
          <br />
          <Link to="/staff/login">
            Staff workspace <ArrowUpRight size={12} />
          </Link>
        </p>
      </footer>
    </>
  );
}
function Reference({
  o,
  set,
  readonly = false,
}: {
  o: Order;
  set?: (o: Order) => void;
  readonly?: boolean;
}) {
  const { notice } = useApp();
  const [note, setNote] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      notice("Use a JPG, PNG or WebP image under 2 MB.");
      return;
    }
    const r = new FileReader();
    r.onload = () => set?.({ ...o, image: String(r.result), markers: [] });
    r.readAsDataURL(file);
  }
  return (
    <div>
      {!readonly && (
        <>
          <Field label="Reference photo (optional, JPG / PNG / WebP, up to 2 MB)">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </Field>
          {o.image && (
            <Field label="Write a note, then tap a spot on the photo">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Make these flowers blue"
              />
            </Field>
          )}
        </>
      )}
      {o.image && (
        <>
          <button
            type="button"
            className="reference"
            disabled={readonly}
            aria-label="Add note to reference image"
            onClick={(e) => {
              if (!note.trim()) return;
              const r = e.currentTarget.getBoundingClientRect();
              set?.({
                ...o,
                markers: [
                  ...o.markers,
                  {
                    x:
                      e.detail === 0
                        ? 50
                        : ((e.clientX - r.left) / r.width) * 100,
                    y:
                      e.detail === 0
                        ? 50
                        : ((e.clientY - r.top) / r.height) * 100,
                    note: note.trim(),
                  },
                ],
              });
              setNote("");
            }}
          >
            <img src={o.image} alt="Customer cake design reference" />
            {o.markers.map((m, i) => (
              <span key={i} style={{ left: m.x + "%", top: m.y + "%" }}>
                {i + 1}
              </span>
            ))}
          </button>
          {o.markers.map((m, i) => (
            <p key={i} className="annotation">
              <b>{i + 1}</b> {m.note}
              {!readonly && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    set?.({
                      ...o,
                      markers: o.markers.filter((_, j) => i !== j),
                    })
                  }
                >
                  Remove
                </button>
              )}
            </p>
          ))}
          {!readonly && (
            <button
              type="button"
              className="text-button"
              onClick={() => set?.({ ...o, image: undefined, markers: [] })}
            >
              Remove photo
            </button>
          )}
        </>
      )}
      <p className="quiet">
        Photos communicate preferences. Final design and feasibility require
        bakery approval.
      </p>
    </div>
  );
}
function Wizard() {
  const { db, save, notice } = useApp();
  const nav = useNavigate();
  const [step, S] = useState(0);
  const [o, O] = useState<Order>(() => {
    try {
      const s = localStorage.getItem("cake-public-draft");
      return s
        ? JSON.parse(s)
        : {
            ...blank(),
            type:
              new URLSearchParams(location.search).get("kind") === "custom"
                ? "Custom design"
                : "Classic celebration",
          };
    } catch {
      return blank();
    }
  });
  const [ack, A] = useState(false);
  const [busy, B] = useState(false);
  const submitting = useRef(false);
  const set = (x: Order) => {
    O(x);
    try {
      localStorage.setItem("cake-public-draft", JSON.stringify(x));
    } catch {
      notice(
        "Draft could not be saved. Remove a large photo or export existing data.",
      );
    }
  };
  const f = (k: keyof Order, v: string) => set({ ...o, [k]: v });
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 3) {
      S(step + 1);
      return;
    }
    if (submitting.current) return;
    submitting.current = true;
    B(true);
    const x = issue(o, "Customer");
    if (save({ ...db, orders: [x, ...db.orders] })) {
      localStorage.removeItem("cake-public-draft");
      sessionStorage.setItem("cake-last-token", x.token);
      nav("/order/confirmation");
    } else {
      submitting.current = false;
      B(false);
    }
  }
  const blocked = unavailable(o.date, o.time, db);
  return (
    <>
      <PublicHeader />
      <main className="wizard">
        <Link className="back" to="/">
          ← Back to the bakery
        </Link>
        <p className="eyebrow">A CAKE WORTH CELEBRATING</p>
        <h1>Let’s bring your idea to life.</h1>
        <p className="muted">
          A few details now. A thoughtful conversation with our team next.
        </p>
        <div className="steps">
          {[
            "Occasion & pickup",
            "Cake details",
            "Your design",
            "Review & send",
          ].map((s, i) => (
            <div
              className={i === step ? "active" : i < step ? "done" : ""}
              key={s}
            >
              <span>{i < step ? <Check size={16} /> : i + 1}</span>
              {s}
            </div>
          ))}
        </div>
        <form className="panel wizard-panel" onSubmit={submit}>
          <div className="panel-title">
            <h2>
              {
                [
                  "What are we celebrating?",
                  "Make it delicious.",
                  "Show us what you have in mind.",
                  "One last look.",
                ][step]
              }
            </h2>
            <span>STEP {step + 1} OF 4</span>
          </div>
          {step === 0 && (
            <>
              <div className="form-grid">
                <Field label="Occasion">
                  <select
                    value={o.occasion}
                    onChange={(e) => f("occasion", e.target.value)}
                  >
                    {[
                      "Birthday",
                      "Anniversary",
                      "Graduation",
                      "Wedding",
                      "Other",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Approximate servings">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={o.servings}
                    onChange={(e) => f("servings", e.target.value)}
                  />
                </Field>
                <Field label="Requested pickup date">
                  <input
                    type="date"
                    min={day()}
                    required
                    value={o.date}
                    onChange={(e) => f("date", e.target.value)}
                  />
                </Field>
                <Field label="Requested pickup time">
                  <input
                    type="time"
                    required
                    value={o.time}
                    onChange={(e) => f("time", e.target.value)}
                  />
                </Field>
              </div>
              {blocked && (
                <p className="warning">
                  {blocked} You may submit for manual review; this is not a
                  reservation.
                </p>
              )}
              <p className="note">
                Regular demo hours: Mon–Fri {db.settings.open}–
                {db.settings.close}, Sat to {db.settings.saturdayClose}.{" "}
                {db.settings.sundayClosed ? "Sunday closed." : ""} Pickup is
                confirmed only after staff approval.
              </p>
            </>
          )}
          {step === 1 && (
            <>
              <div className="form-grid">
                {(
                  [
                    ["type", "Cake style", db.settings.types.split(",")],
                    ["flavor", "Flavor", db.settings.flavors.split(",")],
                    ["filling", "Filling", db.settings.fillings.split(",")],
                    [
                      "frosting",
                      "Frosting",
                      ["Buttercream", "Whipped icing", "Discuss with baker"],
                    ],
                    [
                      "size",
                      "Size",
                      [
                        "6 inch",
                        "8 inch",
                        "10 inch",
                        "Sheet cake",
                        "Discuss with baker",
                      ],
                    ],
                    ["shape", "Shape", ["Round", "Rectangle", "Custom"]],
                  ] as [keyof Order, string, string[]][]
                ).map(([k, l, opts]) => (
                  <Field label={l} key={k}>
                    <select
                      value={String(o[k])}
                      onChange={(e) => f(k, e.target.value)}
                    >
                      {opts.map((x) => (
                        <option key={x} value={x.trim()}>
                          {x.trim()}
                        </option>
                      ))}
                    </select>
                  </Field>
                ))}
                <Field label="Preferred colors (optional)">
                  <input
                    value={o.colors}
                    onChange={(e) => f("colors", e.target.value)}
                  />
                </Field>
                <Field label="Cake inscription (optional)">
                  <input
                    maxLength={120}
                    value={o.inscription}
                    onChange={(e) => f("inscription", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Allergy or dietary notes (optional)">
                <textarea
                  value={o.dietary}
                  onChange={(e) => f("dietary", e.target.value)}
                  placeholder="Please discuss allergies directly with the bakery. Availability is not guaranteed."
                />
              </Field>
              <p className="note">
                All choices are example options and subject to availability.
                Classic example configuration starts at{" "}
                {money(db.settings.classicPrice)}; custom decorations require a
                reviewed quote.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Describe your cake">
                <textarea
                  required
                  value={o.description}
                  onChange={(e) => f("description", e.target.value)}
                  placeholder="A garden-inspired birthday cake with blue flowers…"
                  rows={4}
                />
              </Field>
              <Reference o={o} set={set} />
            </>
          )}
          {step === 3 && (
            <>
              <Summary o={o} />
              <div className="form-grid">
                <Field label="Your name">
                  <input
                    required
                    maxLength={100}
                    value={o.name}
                    onChange={(e) => f("name", e.target.value)}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Phone number">
                  <input
                    required
                    type="tel"
                    value={o.phone}
                    onChange={(e) => f("phone", e.target.value)}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email (optional)">
                  <input
                    type="email"
                    value={o.email}
                    onChange={(e) => f("email", e.target.value)}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Preferred contact">
                  <select
                    value={o.contact}
                    onChange={(e) => f("contact", e.target.value)}
                  >
                    <option>Phone</option>
                    <option disabled={!o.email}>Email</option>
                  </select>
                </Field>
              </div>
              <label className="check">
                <input
                  type="checkbox"
                  required
                  checked={ack}
                  onChange={(e) => A(e.target.checked)}
                />
                I understand this request is not confirmed until reviewed by the
                bakery.
              </label>
              <p className="quiet">
                Demo only: no email will be sent. Keep your order link to review
                updates on this browser.
              </p>
            </>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              disabled={step === 0}
              onClick={() => S(step - 1)}
            >
              Back
            </button>
            <span className="quiet">Draft saved on this browser</span>
            <button className="button" disabled={busy}>
              {step === 3 ? "Send cake request" : "Continue"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
function Summary({ o }: { o: Order }) {
  return (
    <dl className="summary">
      <div>
        <dt>THE CAKE</dt>
        <dd>{o.description || o.type}</dd>
        <small>
          {o.size} · {o.flavor} · {o.servings} servings
          <br />
          {o.filling} · {o.frosting} · {o.shape}
        </small>
      </div>
      <div>
        <dt>REQUESTED PICKUP</dt>
        <dd>
          {o.date} at {o.time}
        </dd>
        <small>
          {o.occasion} · {o.source.toLowerCase()}
          <br />
          {o.inscription && "“" + o.inscription + "”"}
        </small>
      </div>
      {o.colors && (
        <div>
          <dt>COLORS</dt>
          <dd>{o.colors}</dd>
        </div>
      )}
      {o.dietary && (
        <div>
          <dt>DIETARY NOTES</dt>
          <dd>{o.dietary}</dd>
        </div>
      )}
    </dl>
  );
}
function Confirmation() {
  const { db } = useApp();
  const o = db.orders.find(
    (o) => o.token === sessionStorage.getItem("cake-last-token"),
  );
  return (
    <>
      <PublicHeader />
      <main className="narrow panel confirmation">
        <span className="success-icon">
          <Check />
        </span>
        <p className="eyebrow">YOUR IDEA IS IN GOOD HANDS</p>
        <h1>Request received.</h1>
        <p>
          Awaiting bakery approval. Your cake and pickup date are not yet
          confirmed.
        </p>
        {o ? (
          <>
            <h3>{o.id}</h3>
            <Link className="button" to={"/request/" + o.token}>
              View your CakeCard <ArrowRight size={16} />
            </Link>
            <p className="quiet">
              Save this private demo link. No confirmation email was sent.
            </p>
          </>
        ) : (
          <Link to="/order">Start an order</Link>
        )}
      </main>
    </>
  );
}
function Login() {
  const { setRole } = useApp();
  const nav = useNavigate();
  return (
    <>
      <PublicHeader />
      <main className="narrow panel">
        <p className="eyebrow">THE BAKERY WORKSPACE</p>
        <h1>Welcome to CakeDesk.</h1>
        <p>
          This is a local demonstration, not secure staff authentication. Choose
          a fictional role to explore its workflow.
        </p>
        {["Owner", "Manager", "Counter", "Baker"].map((r) => (
          <button
            key={r}
            className="role-button"
            onClick={() => {
              setRole(r);
              nav("/staff");
            }}
          >
            <span>
              <strong>Demo {r}</strong>
              <small>
                {r === "Baker"
                  ? "Production instructions and preparation updates"
                  : r === "Counter"
                    ? "Order intake, communication and pickup"
                    : r === "Owner"
                      ? "Full demo access and settings"
                      : "Orders, quotes and production"}
              </small>
            </span>
            <ArrowRight size={18} />
          </button>
        ))}
        <p className="warning">
          Production access requires server-side authentication and
          authorization. Never enter real customer information here.
        </p>
      </main>
    </>
  );
}
function Demo() {
  const { db, save, setRole, notice } = useApp();
  const nav = useNavigate();
  return (
    <>
      <PublicHeader />
      <main className="demo-page">
        <p className="eyebrow">ONE ORDER. EVERY DETAIL. ALWAYS TOGETHER.</p>
        <h1>Behind the bakery counter.</h1>
        <p className="lead">
          Explore how an idea becomes a cake, without a paper form getting lost
          along the way.
        </p>
        <div className="demo-actions">
          <button
            className="button"
            onClick={() => {
              setRole("Manager");
              nav("/staff");
            }}
          >
            Open staff workspace <ArrowRight size={17} />
          </button>
          <Link className="button secondary" to="/order?kind=custom">
            Try customer ordering
          </Link>
        </div>
        <div className="scenario-grid">
          {[
            [
              "A",
              "A familiar favorite",
              "A classic birthday cake, confirmed and on the production board.",
              "/staff/production",
            ],
            [
              "B",
              "From inspiration to quote",
              "Review the floral cake request, discuss the design, and send a quote.",
              "/staff/quotes",
            ],
            [
              "C",
              "A call at the counter",
              "Save a phone order quickly. Fill in the finer details afterward.",
              "/staff/orders/new",
            ],
            [
              "D",
              "A change of plans",
              "Open a customer CakeCard, request a revision, and reapprove the final design.",
              "/staff/orders",
            ],
            [
              "E",
              "A fully booked day",
              "Sunday is closed in demo settings. Requests need manual review.",
              "/order",
            ],
          ].map(([n, t, p, to]) => (
            <button
              className="scenario panel"
              key={n}
              onClick={() => {
                setRole("Manager");
                nav(to);
              }}
            >
              <span className="scenario-letter">{n}</span>
              <h2>{t}</h2>
              <p>{p}</p>
              <span>
                Explore scenario <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
        <div className="panel">
          <h3>A transparent demonstration</h3>
          <p>
            All orders and reports are fictional. Data stays in this browser.
            Demo roles demonstrate interface restrictions, not real security.
            Payments, email delivery, scheduled backups and production
            authentication are not configured.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              if (
                confirm(
                  "Replace all local demo orders and settings with the fictional samples? Export first if needed.",
                )
              ) {
                if (save(seed())) {
                  localStorage.removeItem("cake-public-draft");
                  localStorage.removeItem("cake-intake-draft");
                  notice("Demo reset to fictional sample data.");
                }
              }
            }}
          >
            Reset demo
          </button>
          <span className="quiet"> {db.orders.length} local records</span>
        </div>
      </main>
    </>
  );
}
const navItems = [
  ["", "Overview", LayoutDashboard],
  ["orders", "Orders", ClipboardList],
  ["orders/new", "New order", Plus],
  ["quotes", "Quotes", MessageSquare],
  ["production", "Production", ChefHat],
  ["calendar", "Calendar", CalendarDays],
  ["reports", "Reports", ChartNoAxesCombined],
  ["settings", "Settings", SettingsIcon],
] as const;
function Staff() {
  const { role, setRole } = useApp();
  const [menu, M] = useState(false);
  const loc = useLocation();
  if (!role) return <Navigate to="/staff/login" />;
  const manager = ["Owner", "Manager"].includes(role);
  const allowed =
    role === "Baker"
      ? ["", "production", "calendar"]
      : role === "Counter"
        ? ["", "orders", "orders/new", "production", "calendar"]
        : manager
          ? navItems.map((x) => x[0])
          : [];
  return (
    <div className="staff-layout">
      <aside className={menu ? "open" : ""}>
        <Brand />
        <p className="sidebar-label">BAKERY WORKSPACE</p>
        <nav>
          {navItems
            .filter(([p]) => allowed.includes(p))
            .map(([p, label, Icon]) => (
              <Link
                key={p}
                to={"/staff" + (p ? "/" + p : "")}
                className={
                  loc.pathname === "/staff" + (p ? "/" + p : "")
                    ? "selected"
                    : ""
                }
                onClick={() => M(false)}
              >
                <Icon size={18} />
                {label}
                {p === "quotes" && <span className="nav-dot" />}
              </Link>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Flower2 size={23} />
            <h4>A little care, everywhere.</h4>
            <p>
              One shared record from
              <br />
              first idea to pickup.
            </p>
          </div>
          <button className="profile" onClick={() => setRole("")}>
            <span className="avatar">D{role[0]}</span>
            <span>
              Demo {role}
              <small>Switch demo role</small>
            </span>
            <ChevronRight size={15} />
          </button>
        </div>
      </aside>
      <div className="staff-main">
        <header className="workspace-header">
          <button
            className="mobile-menu icon-button"
            aria-label="Toggle navigation"
            onClick={() => M(!menu)}
          >
            <Menu size={22} />
          </button>
          <div>
            <span className="muted">Workspace</span>
            <ChevronRight size={13} />
            <span>
              {navItems.find(
                ([p]) => loc.pathname === "/staff" + (p ? "/" + p : ""),
              )?.[1] || "CakeCard"}
            </span>
          </div>
          <Link to="/" className="view-site">
            Customer website <ArrowUpRight size={14} />
          </Link>
          <span className="workspace-date">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </header>
        <main className="workspace">
          <Routes>
            <Route
              index
              element={
                role === "Baker" ? (
                  <Navigate to="/staff/production" replace />
                ) : (
                  <Overview />
                )
              }
            />
            <Route
              path="orders"
              element={role === "Baker" ? <Denied /> : <Orders />}
            />
            <Route
              path="orders/new"
              element={role === "Baker" ? <Denied /> : <Intake />}
            />
            <Route path="orders/:id" element={<CakeCard />} />
            <Route
              path="quotes"
              element={manager ? <Orders quotes /> : <Denied />}
            />
            <Route path="production" element={<Production />} />
            <Route path="calendar" element={<Production calendar />} />
            <Route
              path="reports"
              element={manager ? <Reports /> : <Denied />}
            />
            <Route
              path="settings"
              element={role === "Owner" ? <Settings /> : <Denied />}
            />
            <Route path="*" element={<Navigate to="/staff" />} />
          </Routes>
          <div className="workspace-footer">
            <span>BING’S CAKEDESK</span>
            <span>Made for the way a bakery works.</span>
            <span>LOCAL DEMO · SAMPLE DATA</span>
          </div>
        </main>
      </div>
    </div>
  );
}
function Denied() {
  return (
    <div className="panel">
      <ShieldCheck />
      <h2>This demo role does not have access.</h2>
      <Link to="/staff/login">Choose another demo role</Link>
    </div>
  );
}
function Heading({
  eyebrow,
  title,
  sub,
  action = true,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  action?: boolean;
}) {
  const { role } = useApp();
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{sub}</p>
      </div>
      {action && role !== "Baker" && (
        <Link className="button" to="/staff/orders/new">
          <Plus size={17} /> New order
        </Link>
      )}
    </div>
  );
}
function Overview() {
  const { db, role } = useApp();
  const today = db.orders.filter((o) => committed(o) && o.date === day());
  const tomorrow = db.orders.filter((o) => committed(o) && o.date === day(1));
  const review = db.orders.filter((o) =>
    ["Awaiting Review", "Needs Clarification"].includes(o.status),
  );
  const approval = db.orders.filter((o) => o.status === "Awaiting Approval");
  const overdue = db.orders.filter(
    (o) =>
      !committed(o) &&
      o.status !== "Canceled" &&
      Date.now() - Date.parse(o.quotes.at(-1)?.sent || o.created) > 86400000,
  );
  const cards = [
    ["Today’s pickups", today.length, "Confirmed for today", CalendarDays],
    ["Needs review", review.length, "A little attention needed", MessageSquare],
    ["Tomorrow’s pickups", tomorrow.length, "A look at what’s next", Sun],
    ["Awaiting approval", approval.length, "With the customer", Clock],
  ] as const;
  return (
    <>
      <Heading
        eyebrow="A GOOD DAY STARTS HERE"
        title="Order overview"
        sub="Every cake, every detail. All in one place."
      />
      <div className="overview-greeting">
        <span>
          <Sun size={18} /> Welcome back, Demo {role}.
        </span>
        <span>Let’s make today run a little smoother.</span>
      </div>
      <div className="stats">
        {cards.map(([label, n, desc, Icon], i) => (
          <Link
            key={label}
            to={i === 0 || i === 2 ? "/staff/production" : "/staff/quotes"}
            className={"stat stat-" + i}
          >
            <div>
              <span>{label}</span>
              <Icon size={19} />
            </div>
            <strong>{String(n).padStart(2, "0")}</strong>
            <small>
              {desc} <ArrowUpRight size={13} />
            </small>
          </Link>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel table-panel">
          <div className="panel-title">
            <div>
              <h2>Upcoming orders</h2>
              <p>The next celebrations on the calendar.</p>
            </div>
            <Link className="text-link" to="/staff/orders">
              View all orders <ArrowRight size={14} />
            </Link>
          </div>
          <OrderTable
            orders={db.orders
              .filter(
                (o) => o.status !== "Canceled" && o.status !== "Picked Up",
              )
              .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
              .slice(0, 5)}
          />
        </section>
        <section className="panel attention">
          <span className="eyebrow">ON YOUR RADAR</span>
          <h2>A little attention.</h2>
          <div className="attention-icon">
            <MessageSquare size={24} />
          </div>
          <h3>{review.length} requests to review</h3>
          <p>
            A few ideas are waiting for your expertise. Review the details and
            keep the conversation going.
          </p>
          <Link className="button secondary" to="/staff/quotes">
            Review requests <ArrowRight size={15} />
          </Link>
          <div className="overdue">
            <Clock size={16} />
            {overdue.length} responses over one day old
          </div>
        </section>
      </div>
      <div className="bottom-panels">
        <section className="panel daily-note">
          <span className="icon-tile">
            <ClipboardList />
          </span>
          <div>
            <h3>A dependable start to the day</h3>
            <p>
              Reconcile today’s confirmed orders before preparation. Print a
              production sheet for the decorating bench.
            </p>
          </div>
          <Link to="/staff/production">
            <ArrowUpRight size={20} />
          </Link>
        </section>
        <section className="panel daily-note">
          <span className="icon-tile green">
            <ShieldCheck />
          </span>
          <div>
            <h3>Good records. Fewer surprises.</h3>
            <p>
              Every change stays with its CakeCard. Sample data is stored on
              this browser; export regularly.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
function OrderTable({ orders }: { orders: Order[] }) {
  const { role } = useApp();
  return !orders.length ? (
    <Empty text="Orders will appear here once they are saved." />
  ) : (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>ORDER / CUSTOMER</th>
            <th>THE CAKE</th>
            <th>PICKUP</th>
            <th>STATUS</th>
            <th aria-label="Open order" />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link to={"/staff/orders/" + o.id}>
                  <b>{o.id}</b>
                  <small>
                    {role === "Baker" ? "Production order" : o.name}
                  </small>
                </Link>
              </td>
              <td>
                <span
                  className={
                    "mini-cake " + (o.type === "Custom design" ? "pink" : "")
                  }
                >
                  <ChefHat size={18} />
                </span>
                <span className="cake-cell">
                  {o.description || o.type}
                  <small>
                    {o.flavor} · {o.size}
                  </small>
                </span>
              </td>
              <td>
                {o.date === day()
                  ? "Today"
                  : o.date === day(1)
                    ? "Tomorrow"
                    : o.date}
                <small>{o.time}</small>
              </td>
              <td>
                <Badge status={o.status} />
              </td>
              <td>
                <Link
                  className="open-order"
                  aria-label={"Open " + o.id}
                  to={"/staff/orders/" + o.id}
                >
                  <ChevronRight size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Orders({ quotes = false }: { quotes?: boolean }) {
  const { db } = useApp();
  const [q, Q] = useState("");
  const [filter, F] = useState("All");
  const orders = db.orders.filter(
    (o) =>
      (!quotes ||
        [
          "Awaiting Review",
          "Needs Clarification",
          "Awaiting Approval",
        ].includes(o.status)) &&
      (filter === "All" || o.status === filter) &&
      [o.id, o.name, o.phone, o.date, o.description]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <>
      <Heading
        eyebrow={
          quotes ? "A HUMAN TOUCH, AT EVERY STEP" : "ONE SHARED SOURCE OF TRUTH"
        }
        title={quotes ? "Quotes & conversations" : "All cake orders"}
        sub={
          quotes
            ? "Review what’s possible. Price it thoughtfully. Get it approved."
            : "From the first request to the last slice, nothing gets lost."
        }
      />
      <section className="panel table-panel">
        <div className="filters">
          <label className="search">
            <Search size={17} />
            <input
              aria-label="Search orders"
              placeholder="Search name, order number, phone or date…"
              value={q}
              onChange={(e) => Q(e.target.value)}
            />
          </label>
          <select
            aria-label="Filter order status"
            value={filter}
            onChange={(e) => F(e.target.value)}
          >
            {[
              "All",
              "Awaiting Review",
              "Needs Clarification",
              "Awaiting Approval",
              "Confirmed",
              "In Production",
              "Ready",
              "Picked Up",
              "Canceled",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span className="quiet">{orders.length} orders</span>
        </div>
        <OrderTable orders={orders} />
      </section>
    </>
  );
}
function Intake() {
  const submitting = useRef(false);
  const { db, save, notice } = useApp();
  const nav = useNavigate();
  const [start] = useState(Date.now());
  const [o, O] = useState<Order>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("cake-intake-draft") || "null") || {
          ...blank(),
          source: "PHONE",
        }
      );
    } catch {
      return { ...blank(), source: "PHONE" };
    }
  });
  const [override, V] = useState(false);
  const set = (x: Order) => {
    O(x);
    try {
      localStorage.setItem("cake-intake-draft", JSON.stringify(x));
    } catch {
      notice("Draft storage unavailable.");
    }
  };
  const duplicate = db.orders.some(
    (x) =>
      ((x.phone === o.phone && o.phone) ||
        (x.name.toLowerCase() === o.name.toLowerCase() && o.name)) &&
      x.date === o.date,
  );
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (duplicate && !override) {
      notice("Review the possible duplicate and acknowledge it before saving.");
      return;
    }
    if (submitting.current) return;
    submitting.current = true;
    const x = issue(
      { ...o, entrySeconds: Math.round((Date.now() - start) / 1000) },
      "Demo staff",
    );
    if (save({ ...db, orders: [x, ...db.orders] })) {
      localStorage.removeItem("cake-intake-draft");
      notice("Order " + x.id + " saved. Add details any time.");
      nav("/staff/orders/" + x.id);
    } else submitting.current = false;
  }
  return (
    <>
      <Heading
        eyebrow="NO PAPER FORM REQUIRED"
        title="New cake order"
        sub="Save the essentials now. Add the finer details afterward."
        action={false}
      />
      <form className="panel intake" onSubmit={submit}>
        <div className="panel-title">
          <h2>A quick start</h2>
          <span className="quiet">
            <Clock size={14} /> Target: 60–90 seconds
          </span>
        </div>
        <div className="segmented">
          {["PHONE", "IN PERSON"].map((s) => (
            <button
              type="button"
              key={s}
              className={o.source === s ? "active" : ""}
              onClick={() => set({ ...o, source: s })}
            >
              {s === "PHONE" ? (
                <Phone size={16} />
              ) : (
                <ClipboardList size={16} />
              )}{" "}
              {s === "PHONE" ? "Phone order" : "In-person order"}
            </button>
          ))}
        </div>
        <div className="form-grid">
          <Field label="Customer name">
            <input
              required
              value={o.name}
              onChange={(e) => set({ ...o, name: e.target.value })}
            />
          </Field>
          <Field label="Phone or another usable contact">
            <input
              required
              value={o.phone}
              onChange={(e) => set({ ...o, phone: e.target.value })}
            />
          </Field>
          <Field label="Requested pickup date">
            <input
              type="date"
              min={day()}
              required
              value={o.date}
              onChange={(e) => set({ ...o, date: e.target.value })}
            />
          </Field>
          <Field label="Requested pickup time">
            <input
              type="time"
              required
              value={o.time}
              onChange={(e) => set({ ...o, time: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Cake description">
          <textarea
            required
            placeholder="8-inch chocolate birthday cake, blue flowers…"
            value={o.description}
            onChange={(e) => set({ ...o, description: e.target.value })}
          />
        </Field>
        <label className="check">
          <input
            type="checkbox"
            checked={o.followUp}
            onChange={(e) => set({ ...o, followUp: e.target.checked })}
          />
          Needs follow-up / details incomplete
        </label>
        {duplicate && (
          <div className="warning">
            A similar customer and pickup date already exists.
            <label className="check">
              <input
                type="checkbox"
                checked={override}
                onChange={(e) => V(e.target.checked)}
              />
              I reviewed the matching order and this is a separate request.
            </label>
          </div>
        )}
        <div className="form-actions">
          <span className="quiet">Partial draft saved on this browser</span>
          <button className="button">
            Save order <Check size={17} />
          </button>
        </div>
      </form>
    </>
  );
}
function Customer() {
  const { token } = useParams();
  const { db, update, notice } = useApp();
  const o = db.orders.find((x) => x.token === token);
  const [change, D] = useState("");
  const [verify, V] = useState("");
  if (!o)
    return (
      <>
        <PublicHeader />
        <main className="narrow panel">
          <h1>Order link not found.</h1>
          <p>
            This private demo link is invalid or belongs to another browser.
          </p>
        </main>
      </>
    );
  const quote = o.quotes.at(-1);
  function accept() {
    if (!o) return;
    if (verify.trim() !== o.phone.trim()) {
      notice("Enter the contact number on this demo order to approve.");
      return;
    }
    if (
      !quote ||
      Date.now() - Date.parse(quote.sent) > db.settings.expiry * 86400000
    ) {
      notice("This quote has expired. Please request a revised quote.");
      return;
    }
    update(
      {
        ...o,
        quotes: o.quotes.map((q) =>
          q.version === quote.version ? { ...q, approved: stamp() } : q,
        ),
        approvedDesign: quote.design,
        description: quote.design,
        revision: undefined,
      },
      "Customer approved quote v" + quote.version,
    );
    notice("Approval saved. Bakery confirmation is still required.");
  }
  return (
    <>
      <PublicHeader />
      <main className="customer-card">
        <p className="eyebrow">YOUR CAKE, ALL TOGETHER</p>
        <div className="page-heading">
          <div>
            <h1>Your CakeCard</h1>
            <p className="muted">{o.id} · Keep this link private.</p>
          </div>
          <Badge status={o.status} />
        </div>
        <div className="note">
          Local demo: this link works only in the browser storing the record. It
          is not a production access-control system.
        </div>
        <div className="detail-grid">
          <div>
            <section className="panel">
              <h2>The celebration details</h2>
              <Summary o={o} />
              {o.approvedDesign && (
                <p className="note">
                  <strong>Last approved design:</strong> {o.approvedDesign}
                </p>
              )}
              {o.revision && (
                <p className="warning">
                  Proposed change: {o.revision}. Approved production
                  instructions stay unchanged until reapproval.
                </p>
              )}
              <Reference o={o} readonly />
            </section>
            <section className="panel">
              <h2>Keep the conversation going</h2>
              <Messages o={o} customer />
            </section>
            <section className="panel">
              <h2>A change in mind?</h2>
              <p>
                Propose a change for the bakery to review. It won’t alter the
                approved production instructions.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    update(
                      {
                        ...o,
                        revision: change,
                        followUp: true,
                        messages: [
                          ...o.messages,
                          {
                            author: "Customer",
                            text: "Change requested: " + change,
                            private: false,
                            at: stamp(),
                          },
                        ],
                      },
                      "Customer proposed a design revision",
                    )
                  ) {
                    D("");
                    notice("Change request saved for staff review.");
                  }
                }}
              >
                <Field label="Proposed design changes">
                  <textarea
                    required
                    value={change}
                    onChange={(e) => D(e.target.value)}
                  />
                </Field>
                <button className="button secondary">Request a change</button>
              </form>
            </section>
          </div>
          <div>
            <section className="panel quote-summary">
              <span className="eyebrow">BAKERY-REVIEWED PRICING</span>
              <h2>Your quote</h2>
              {quote ? (
                <>
                  <strong className="quote-total">{money(quote.total)}</strong>
                  <p>
                    Version {quote.version} ·{" "}
                    {quote.approved ? "Approved" : "Awaiting your review"}
                  </p>
                  <p>{quote.design}</p>
                  {(
                    [
                      "base",
                      "extras",
                      "materials",
                      "labor",
                      "delivery",
                      "discount",
                      "tax",
                    ] as const
                  ).map(
                    (k) =>
                      quote[k] !== 0 && (
                        <div className="price-line" key={k}>
                          <span>
                            {k === "base"
                              ? "Base cake"
                              : k === "labor"
                                ? "Custom decoration"
                                : k === "materials"
                                  ? "Special materials"
                                  : k}
                          </span>
                          <span>
                            {k === "discount" ? "−" : ""}
                            {money(quote[k])}
                          </span>
                        </div>
                      ),
                  )}
                  {!quote.approved && o.status !== "Canceled" && (
                    <>
                      <Field label="Verify your order contact number">
                        <input
                          value={verify}
                          onChange={(e) => V(e.target.value)}
                          autoComplete="tel"
                        />
                      </Field>
                      <button className="button full" onClick={accept}>
                        Accept quote v{quote.version}
                      </button>
                      <button
                        className="text-button"
                        onClick={() => {
                          update(
                            {
                              ...o,
                              status: "Needs Clarification",
                              messages: [
                                ...o.messages,
                                {
                                  author: "Customer",
                                  text:
                                    "I declined quote v" +
                                    quote.version +
                                    ". Please discuss alternatives.",
                                  private: false,
                                  at: stamp(),
                                },
                              ],
                            },
                            "Customer declined quote",
                          );
                          notice(
                            "Decline recorded. The bakery can discuss alternatives.",
                          );
                        }}
                      >
                        Decline / discuss alternatives
                      </button>
                    </>
                  )}
                  <p className="quiet">
                    Valid for {db.settings.expiry} days from{" "}
                    {new Date(quote.sent).toLocaleDateString()}. Acceptance is
                    not bakery confirmation.
                  </p>
                </>
              ) : (
                <>
                  <Clock size={28} />
                  <p>
                    Your request is awaiting bakery review. A staff member will
                    review feasibility and pricing.
                  </p>
                </>
              )}
            </section>
            <section className="panel">
              <h3>Pickup & payment</h3>
              <p>
                {committed(o) ? "Confirmed" : "Requested"}: {o.date} at {o.time}
              </p>
              <p>
                {o.payment} · amount received {money(o.deposit)}
                {quote && (
                  <> · balance {money(Math.max(0, quote.total - o.deposit))}</>
                )}
              </p>
              <p className="quiet">
                Payments are handled through the bakery’s existing process. No
                online payments or email delivery are configured.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
function Messages({ o, customer = false }: { o: Order; customer?: boolean }) {
  const { update, role } = useApp();
  const [text, T] = useState("");
  const [priv, P] = useState(false);
  return (
    <>
      <div className="messages">
        {o.messages
          .filter((m) => !customer || !m.private)
          .map((m, i) => (
            <div key={i} className={"message " + (m.private ? "private" : "")}>
              <div>
                <b>
                  {m.author}
                  {m.private ? " · Staff only" : ""}
                </b>
                <small>{new Date(m.at).toLocaleString()}</small>
              </div>
              <p>{m.text}</p>
            </div>
          ))}
        {!o.messages.filter((m) => !customer || !m.private).length && (
          <p className="quiet">
            The conversation starts here. Messages are saved with this order; no
            notification is sent.
          </p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            update(
              {
                ...o,
                status:
                  !customer && !priv && !committed(o)
                    ? "Needs Clarification"
                    : o.status,
                messages: [
                  ...o.messages,
                  {
                    author: customer ? "Customer" : "Demo " + role,
                    text,
                    private: !customer && priv,
                    at: stamp(),
                  },
                ],
              },
              customer
                ? "Customer replied"
                : priv
                  ? "Private staff note added"
                  : "Staff sent a clarification",
            )
          )
            T("");
        }}
      >
        <Field label={customer ? "Your reply" : "Message or internal note"}>
          <textarea
            required
            maxLength={3000}
            value={text}
            onChange={(e) => T(e.target.value)}
          />
        </Field>
        {!customer && (
          <label className="check">
            <input
              type="checkbox"
              checked={priv}
              onChange={(e) => P(e.target.checked)}
            />
            Private staff note
          </label>
        )}
        <button className="button secondary">
          {priv && !customer ? "Save staff note" : "Save message"}{" "}
          <MessageSquare size={15} />
        </button>
      </form>
    </>
  );
}
function CakeCard() {
  const { id } = useParams();
  const { db, update, role, notice } = useApp();
  const o = db.orders.find((x) => x.id === id);
  const manager = ["Owner", "Manager"].includes(role);
  if (!o) return <Empty text="This order could not be found." />;
  if (role === "Baker" && !committed(o)) return <Denied />;
  const current = o.quotes.at(-1);
  function state(status: Status) {
    if (!o) return;
    if (status === "Confirmed") {
      if (!manager) return;
      const error = unavailable(o.date, o.time, db, o.id);
      if (
        error &&
        !confirm(error + " Authorize a manager override and record it?")
      )
        return;
      if (!current?.approved) {
        notice(
          "The customer must approve the latest quote before confirmation.",
        );
        return;
      }
      if (o.revision) {
        notice("Send and obtain approval for the proposed revision first.");
        return;
      }
      if (
        o.deposit < db.settings.deposit ||
        (db.settings.deposit > 0 && !o.payment.startsWith("Verified"))
      ) {
        notice(
          "Verify the required deposit through the bakery’s existing payment process first.",
        );
        return;
      }
      if (!o.description || !o.flavor || !o.time) {
        notice("Complete the essential production details.");
        return;
      }
      update(
        { ...o, status, confirmed: stamp(), followUp: false },
        error
          ? "Manager confirmed with availability override: " + error
          : "Bakery confirmed approved order",
      );
      return;
    }
    update({ ...o, status }, "Status changed to " + status);
  }
  return (
    <>
      <Link className="back" to="/staff/orders">
        ← All orders
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">THE LIVING CAKECARD · {o.source}</p>
          <h1>{o.description || "Cake request"}</h1>
          <p className="muted">
            {o.id} · {role === "Baker" ? "Production instructions" : o.name} ·
            Created {new Date(o.created).toLocaleDateString()}
          </p>
        </div>
        <Badge status={o.status} />
      </div>
      <div className="detail-actions">
        <button className="button secondary" onClick={() => window.print()}>
          <Printer size={16} /> Print production sheet
        </button>
        {role !== "Baker" && (
          <>
            <button
              className="button secondary"
              onClick={() =>
                download(
                  o.id + ".json",
                  JSON.stringify(
                    manager
                      ? o
                      : {
                          ...o,
                          quotes: o.quotes.map(
                            ({ cost: _privateCost, ...quote }) => quote,
                          ),
                        },
                    null,
                    2,
                  ),
                )
              }
            >
              <Download size={16} /> Export CakeCard
            </button>
            <Link
              className="button secondary"
              to={"/request/" + o.token}
              target="_blank"
            >
              Customer view <ArrowUpRight size={15} />
            </Link>
          </>
        )}
        {manager && !committed(o) && o.status !== "Canceled" && (
          <button className="button" onClick={() => state("Confirmed")}>
            Confirm approved order <Check size={16} />
          </button>
        )}
        {(manager || role === "Baker") && o.status === "Confirmed" && (
          <button className="button" onClick={() => state("In Production")}>
            Start preparation
          </button>
        )}
        {(manager || role === "Baker") && o.status === "In Production" && (
          <button className="button" onClick={() => state("Ready")}>
            Mark ready
          </button>
        )}
        {role !== "Baker" && o.status === "Ready" && (
          <button className="button" onClick={() => state("Picked Up")}>
            Mark picked up
          </button>
        )}
      </div>
      <div className="detail-grid">
        <div>
          <section className="panel print-sheet">
            <div className="panel-title">
              <h2>Approved production instructions</h2>
              <ChefHat size={21} />
            </div>
            {!committed(o) && (
              <p className="warning">
                Request only. Not a production commitment.
              </p>
            )}
            <h3>{o.approvedDesign || o.description}</h3>
            <Summary o={o} />
            <p>
              <strong>Preparation:</strong> {o.prep} · <strong>Pickup:</strong>{" "}
              {o.date}, {o.time}
            </p>
            <p>
              <strong>Payment:</strong> {o.payment}
            </p>
            <Reference o={o} readonly />
            {o.revision && (
              <p className="warning">
                Proposed revision awaiting approval: {o.revision}
              </p>
            )}
            {o.followUp && (
              <p className="warning">
                Needs follow-up. Check details before confirmation.
              </p>
            )}
          </section>
          {role !== "Baker" && (
            <>
              <EditDetails o={o} />
              <section className="panel">
                <h2>Conversation & staff notes</h2>
                <Messages o={o} />
              </section>
            </>
          )}
          <section className="panel">
            <h2>Order history</h2>
            <div className="timeline">
              {[...o.events].reverse().map((e, i) => (
                <div key={i}>
                  <span />
                  <div>
                    <strong>{e.text}</strong>
                    <small>
                      {new Date(e.at).toLocaleString()} · {e.actor}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div>
          {manager && <QuoteBuilder key={o.id + "-" + o.quotes.length} o={o} />}
          <section className="panel">
            <h2>Order essentials</h2>
            {role !== "Baker" && (
              <>
                <p>
                  {o.name}
                  <br />
                  {o.phone}
                  <br />
                  {o.email}
                </p>
                <hr />
              </>
            )}
            <p>
              Requested pickup
              <br />
              <strong>
                {o.date} at {o.time}
              </strong>
            </p>
            <p>
              Confirmed
              <br />
              <strong>
                {o.confirmed
                  ? new Date(o.confirmed).toLocaleString()
                  : "Not yet confirmed"}
              </strong>
            </p>
            <p>
              Current approved price
              <br />
              <strong>
                {money(
                  [...o.quotes].reverse().find((q) => q.approved)?.total || 0,
                )}
              </strong>
            </p>
            <p className="quiet">
              {o.quotes.length} quote version(s). Accepted designs remain in the
              audit history.
            </p>
            {manager && o.status !== "Canceled" && (
              <button
                className="text-button danger"
                onClick={() => {
                  if (
                    confirm("Cancel this order? Its history will be retained.")
                  )
                    state("Canceled");
                }}
              >
                Decline / cancel request
              </button>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
function EditDetails({ o }: { o: Order }) {
  const { update, notice, role, db } = useApp();
  const [edit, E] = useState(false);
  const [draft, D] = useState(o);
  const [verified, V] = useState(false);
  if (!edit)
    return (
      <button
        className="button secondary edit-button"
        onClick={() => {
          D(o);
          E(true);
        }}
      >
        Edit cake & pickup details
      </button>
    );
  const locked = committed(o) || o.quotes.some((q) => q.approved);
  return (
    <form
      className="panel"
      onSubmit={(e) => {
        e.preventDefault();
        if (!update(draft, "Staff updated permitted order details")) return;
        E(false);
        notice("Order details saved.");
      }}
    >
      <h2>Order details</h2>
      {locked && (
        <p className="note">
          Approved design and pickup are protected. Request a revision in the
          customer view and issue a new quote to change the design.
        </p>
      )}
      <div className="form-grid">
        {(
          [
            "description",
            "date",
            "time",
            "servings",
            "flavor",
            "filling",
            "frosting",
            "size",
            "colors",
            "inscription",
            "dietary",
          ] as const
        ).map((k) => (
          <Field key={k} label={k === "date" ? "Requested pickup date" : k}>
            <input
              disabled={locked}
              type={k === "date" ? "date" : k === "time" ? "time" : "text"}
              required={["description", "date", "time", "flavor"].includes(k)}
              value={draft[k]}
              onChange={(e) => D({ ...draft, [k]: e.target.value })}
            />
          </Field>
        ))}
        <Field label="Preparation date">
          <input
            type="date"
            required
            value={draft.prep}
            onChange={(e) => D({ ...draft, prep: e.target.value })}
          />
        </Field>
      </div>
      {!locked && <Reference o={draft} set={D} />}
      <label className="check">
        <input
          type="checkbox"
          checked={draft.followUp}
          onChange={(e) => D({ ...draft, followUp: e.target.checked })}
        />
        Needs follow-up
      </label>
      {["Owner", "Manager"].includes(role) && (
        <>
          <hr />
          <h3>Record verified external payment</h3>
          <p className="quiet">
            No payment is processed here. Verify in the bakery’s existing
            payment system first. Required deposit: {money(db.settings.deposit)}
            .
          </p>
          <label className="check">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => V(e.target.checked)}
            />
            I verified the payment externally.
          </label>
          <div className="form-grid">
            <Field label="Payment record">
              <select
                disabled={!verified}
                value={draft.payment}
                onChange={(e) => D({ ...draft, payment: e.target.value })}
              >
                <option>Unverified</option>
                <option>Verified deposit</option>
                <option>Verified paid — cash</option>
                <option>Verified paid — external card</option>
                <option>Verified paid — invoice</option>
              </select>
            </Field>
            <Field label="Verified amount received ($)">
              <input
                type="number"
                min="0"
                step="0.01"
                disabled={!verified}
                value={draft.deposit}
                onChange={(e) =>
                  D({ ...draft, deposit: Number(e.target.value) })
                }
              />
            </Field>
          </div>
        </>
      )}
      <div className="form-actions">
        <button
          type="button"
          className="button secondary"
          onClick={() => E(false)}
        >
          Cancel
        </button>
        <button className="button">Save changes</button>
      </div>
    </form>
  );
}
function QuoteBuilder({ o }: { o: Order }) {
  const { db, update, notice } = useApp();
  const last = o.quotes.at(-1);
  const [p, P] = useState({
    base: last?.base || db.settings.classicPrice,
    extras: 0,
    materials: 0,
    labor: 0,
    delivery: 0,
    discount: 0,
    tax: 0,
    cost: last?.cost || 0,
  });
  const [design, D] = useState(o.revision || o.approvedDesign || o.description);
  const [review, R] = useState(false);
  const total =
    p.base + p.extras + p.materials + p.labor + p.delivery + p.tax - p.discount;
  function send(e: React.FormEvent) {
    e.preventDefault();
    if (total < 0) {
      notice("The quote total cannot be negative.");
      return;
    }
    const q: Quote = {
      ...p,
      total,
      version: o.quotes.length + 1,
      sent: stamp(),
      design,
    };
    if (
      update(
        {
          ...o,
          quotes: [...o.quotes, q],
          status: committed(o) ? o.status : "Awaiting Approval",
          revision: committed(o) ? design : o.revision,
        },
        "Staff sent quote v" + q.version + " — " + money(total),
      )
    ) {
      notice(
        "Quote saved to the customer CakeCard. No email notification was sent.",
      );
      R(false);
    }
  }
  return (
    <section className="panel quote-builder">
      <div className="panel-title">
        <h2>{last ? "Revise quote" : "Build a quote"}</h2>
        <span className="badge">v{o.quotes.length + 1}</span>
      </div>
      <p className="quiet">Human judgment stays in the recipe.</p>
      <form onSubmit={send}>
        <Field label="Design included in this quote">
          <textarea
            required
            value={design}
            onChange={(e) => D(e.target.value)}
          />
        </Field>
        <div className="form-grid">
          {(
            [
              ["base", "Base cake"],
              ["extras", "Standard extras"],
              ["materials", "Special materials"],
              ["labor", "Decoration labor"],
              ["delivery", "Delivery / setup"],
              ["discount", "Discount"],
              ["tax", "Applicable tax ($)"],
            ] as const
          ).map(([k, l]) => (
            <Field label={l + " ($)"} key={k}>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={p[k]}
                onChange={(e) => P({ ...p, [k]: Number(e.target.value) })}
              />
            </Field>
          ))}
        </div>
        <div className="private-cost">
          <span className="eyebrow">
            <ShieldCheck size={13} /> STAFF ONLY
          </span>
          <Field label="Estimated direct cost ($)">
            <input
              type="number"
              min="0"
              required
              step="0.01"
              value={p.cost}
              onChange={(e) => P({ ...p, cost: Number(e.target.value) })}
            />
          </Field>
          <p>
            Estimated margin (excluding tax): {money(total - p.tax - p.cost)}{" "}
            {total - p.tax > 0
              ? "(" +
                Math.round(((total - p.tax - p.cost) / (total - p.tax)) * 100) +
                "%)"
              : ""}
          </p>
        </div>
        <div className="price-line total">
          <span>Proposed total</span>
          <strong>{money(total)}</strong>
        </div>
        <label className="check">
          <input
            required
            type="checkbox"
            checked={review}
            onChange={(e) => R(e.target.checked)}
          />
          I reviewed the design, feasibility and price.
        </label>
        <button className="button full" disabled={o.status === "Canceled"}>
          Send quote for approval <ArrowRight size={16} />
        </button>
        <p className="quiet">
          The exact quote and design are saved together. Later edits require a
          new approval.
        </p>
      </form>
      {o.quotes.length > 0 && (
        <details>
          <summary>Quote history ({o.quotes.length})</summary>
          {o.quotes.map((q) => (
            <div className="quote-history" key={q.version}>
              <b>
                v{q.version} · {money(q.total)}
              </b>
              <p>{q.design}</p>
              <small>
                {q.approved
                  ? "Approved " + new Date(q.approved).toLocaleString()
                  : "Not approved"}{" "}
                · Sent {new Date(q.sent).toLocaleString()}
              </small>
            </div>
          ))}
        </details>
      )}
    </section>
  );
}
function Production({ calendar = false }: { calendar?: boolean }) {
  const { db, update, role, notice } = useApp();
  const [date, D] = useState(day());
  const [range, R] = useState("Today");
  const [filter, F] = useState("All");
  const [basis, B] = useState("pickup");
  const [week, W] = useState(false);
  const end = new Date(date + "T12:00:00");
  end.setDate(end.getDate() + 6);
  const endDate = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
  const orders = db.orders
    .filter(
      (o) =>
        committed(o) &&
        (!o.revision || !!o.approvedDesign) &&
        (filter === "All" || o.status === filter),
    )
    .filter((o) => {
      const d = basis === "prep" ? o.prep : o.date;
      return range === "This week" || (calendar && week)
        ? d >= date && d <= endDate
        : d === date;
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const manager = ["Owner", "Manager"].includes(role);
  return (
    <>
      <Heading
        eyebrow="THE RIGHT CAKE. THE RIGHT DAY."
        title={calendar ? "Pickup calendar" : "The production board"}
        sub="Only confirmed orders. Approved details, right where you need them."
        action={false}
      />
      <div className="filters panel">
        <div className="segmented">
          {["Today", "Tomorrow", "This week"].map((x) => (
            <button
              className={range === x ? "active" : ""}
              key={x}
              onClick={() => {
                R(x);
                D(x === "Tomorrow" ? day(1) : day());
              }}
            >
              {x}
            </button>
          ))}
        </div>
        <input
          type="date"
          aria-label="Production date"
          value={date}
          onChange={(e) => {
            D(e.target.value);
            R("Date");
          }}
        />
        <select
          aria-label="Date basis"
          value={basis}
          onChange={(e) => B(e.target.value)}
        >
          <option value="pickup">By pickup date</option>
          <option value="prep">By preparation date</option>
        </select>
        <select
          aria-label="Production status"
          value={filter}
          onChange={(e) => F(e.target.value)}
        >
          {["All", "Confirmed", "In Production", "Ready", "Picked Up"].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
        {calendar && (
          <label className="check">
            <input
              type="checkbox"
              checked={week}
              onChange={(e) => W(e.target.checked)}
            />
            Week view
          </label>
        )}
      </div>
      {calendar && (
        <div className="calendar-strip">
          {Array.from({ length: week ? 7 : 1 }, (_, i) => {
            const d = new Date(date + "T12:00:00");
            d.setDate(d.getDate() + i);
            const v = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            return (
              <div className="panel" key={v}>
                <span>
                  {d.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </span>
                <b>
                  {db.orders.filter((o) => committed(o) && o.date === v).length}{" "}
                  cakes
                </b>
              </div>
            );
          })}
        </div>
      )}
      <p className="quiet">
        {orders.length} confirmed orders · {date}
        {range === "This week" || (calendar && week) ? " — " + endDate : ""} ·
        Daily capacity {db.settings.capacity || "not configured"}
      </p>
      {!orders.length ? (
        <section className="panel">
          <Empty text="No confirmed cakes for this view. Pending requests stay in the review queue." />
        </section>
      ) : (
        <div className="production-grid">
          {orders.map((o) => (
            <section key={o.id} className="panel production-card">
              <div className="panel-title">
                <span className="eyebrow">{o.id}</span>
                <Badge status={o.status} />
              </div>
              <div className="production-image">
                {o.image ? (
                  <img src={o.image} alt="Cake reference" />
                ) : (
                  <CakeArt floral={o.type === "Custom design"} />
                )}
              </div>
              <h2>{o.approvedDesign || o.description}</h2>
              <p>
                {o.flavor} · {o.size} · {o.servings} servings
              </p>
              <div className="pickup">
                <Clock size={17} />
                <div>
                  <b>
                    {o.date} · {o.time}
                  </b>
                  <small>Prepare {o.prep}</small>
                </div>
              </div>
              {o.inscription && <p>“{o.inscription}”</p>}
              {(o.followUp ||
                o.revision ||
                !o.flavor ||
                (o.date < day() && o.status !== "Picked Up")) && (
                <p className="warning">
                  {o.revision
                    ? "A revision is pending; use the last approved design."
                    : o.date < day()
                      ? "Pickup deadline has passed."
                      : "Essential details need attention."}
                </p>
              )}
              <div className="production-actions">
                <Link className="button secondary" to={"/staff/orders/" + o.id}>
                  Open CakeCard
                </Link>
                {(((manager || role === "Baker") &&
                  ["Confirmed", "In Production"].includes(o.status)) ||
                  (role !== "Baker" && o.status === "Ready")) && (
                  <button
                    className="button"
                    onClick={() => {
                      const status: Status =
                        o.status === "Confirmed"
                          ? "In Production"
                          : o.status === "In Production"
                            ? "Ready"
                            : "Picked Up";
                      if (
                        update({ ...o, status }, "Status changed to " + status)
                      )
                        notice("Order marked " + status.toLowerCase() + ".");
                    }}
                  >
                    {o.status === "Confirmed"
                      ? "Start preparation"
                      : o.status === "In Production"
                        ? "Mark ready"
                        : "Mark picked up"}
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
function Reports() {
  const { db, save, notice } = useApp();
  const [type, T] = useState("Pickup-date mistake");
  const [note, N] = useState("");
  const measured = db.orders.filter((o) => o.entrySeconds !== undefined);
  const quoted = db.orders.filter((o) => o.quotes.length);
  const hours = quoted.length
    ? quoted.reduce(
        (n, o) =>
          n + (Date.parse(o.quotes[0].sent) - Date.parse(o.created)) / 3600000,
        0,
      ) / quoted.length
    : null;
  return (
    <>
      <Heading
        eyebrow="A CLEARER PICTURE"
        title="Bakery reports"
        sub="Sample Data · These figures reflect fictional local records, not business results."
        action={false}
      />
      <div className="report-stats">
        {[
          ["Orders received", db.orders.length],
          ["Confirmed / active", db.orders.filter(committed).length],
          [
            "Picked up",
            db.orders.filter((o) => o.status === "Picked Up").length,
          ],
          [
            "Cancellations",
            db.orders.filter((o) => o.status === "Canceled").length,
          ],
          [
            "Missing / follow-up",
            db.orders.filter((o) => o.followUp || !o.description || !o.flavor)
              .length,
          ],
          [
            "Completed quoted revenue",
            money(
              db.orders
                .filter((o) => o.status === "Picked Up")
                .reduce(
                  (s, o) =>
                    s +
                    ([...o.quotes].reverse().find((q) => q.approved)?.total ||
                      0),
                  0,
                ),
            ),
          ],
        ].map(([l, v]) => (
          <div className="panel" key={l}>
            <p className="muted">{l}</p>
            <h2>{v}</h2>
          </div>
        ))}
      </div>
      <div className="detail-grid">
        <section className="panel">
          <h2>Intake & turnaround</h2>
          {["ONLINE", "PHONE", "IN PERSON"].map((s) => (
            <div className="report-row" key={s}>
              <span>{s}</span>
              <div className="bar">
                <i
                  style={{
                    width:
                      (db.orders.filter((o) => o.source === s).length /
                        Math.max(db.orders.length, 1)) *
                        100 +
                      "%",
                  }}
                />
              </div>
              <b>{db.orders.filter((o) => o.source === s).length}</b>
            </div>
          ))}
          <p>
            Measured entry time:{" "}
            {measured.length
              ? Math.round(
                  measured.reduce((s, o) => s + (o.entrySeconds || 0), 0) /
                    measured.length,
                ) +
                " seconds average (" +
                measured.length +
                " recorded entries)"
              : "Not measured yet"}
          </p>
          <p>
            Average request → first quote:{" "}
            {hours === null ? "Not measured yet" : hours.toFixed(1) + " hours"}
          </p>
          <p className="quiet">
            Targets: 100% digital capture, zero lost or wrong-date orders, 90%
            of quotes within one business day. Targets are not measured
            achievements.
          </p>
          <button
            className="button secondary"
            onClick={() =>
              download(
                "cakedesk-orders.csv",
                csv(db.orders),
                "text/csv;charset=utf-8",
              )
            }
          >
            <Download size={16} /> Export orders CSV
          </button>
        </section>
        <section className="panel">
          <h2>Operational incidents</h2>
          <p className="quiet">
            Log problems so the pilot measures what matters.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                save({
                  ...db,
                  incidents: [...db.incidents, { type, note, at: stamp() }],
                })
              ) {
                N("");
                notice("Incident recorded.");
              }
            }}
          >
            <Field label="Incident type">
              <select value={type} onChange={(e) => T(e.target.value)}>
                {[
                  "Pickup-date mistake",
                  "Lost-order incident",
                  "Correction",
                  "Other",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="What happened?">
              <textarea
                required
                value={note}
                onChange={(e) => N(e.target.value)}
              />
            </Field>
            <button className="button secondary">Record incident</button>
          </form>
          {db.incidents.map((i, n) => (
            <div className="message" key={n}>
              <b>{i.type}</b>
              <p>{i.note}</p>
              <small>{new Date(i.at).toLocaleString()}</small>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
function Settings() {
  const { db, save, notice } = useApp();
  const [s, S] = useState(db.settings);
  const [restore, R] = useState<DB | null>(null);
  const [error, E] = useState("");
  async function read(file?: File) {
    if (!file) return;
    try {
      const x = JSON.parse(await file.text());
      if (x.version !== 1 || !validDB(x.data))
        throw Error("Not a supported CakeDesk export.");
      R(x.data);
      E("");
    } catch (e) {
      E(String(e));
      R(null);
    }
  }
  return (
    <>
      <Heading
        eyebrow="YOUR BAKERY, YOUR WAY"
        title="Workspace settings"
        sub="Owner controls · Local demonstration settings apply only in this browser."
        action={false}
      />
      <div className="detail-grid">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (save({ ...db, settings: s })) notice("Demo settings saved.");
          }}
        >
          <h2>Cake options & business rules</h2>
          <p className="quiet">
            Comma-separated options. These are examples, not Bing’s actual
            product or pricing policies.
          </p>
          {(["types", "flavors", "fillings"] as const).map((k) => (
            <Field key={k} label={k}>
              <input
                required
                value={s[k]}
                onChange={(e) => S({ ...s, [k]: e.target.value })}
              />
            </Field>
          ))}
          <div className="form-grid">
            {(
              [
                ["classicPrice", "Classic example base price ($)"],
                ["deposit", "Required verified deposit ($)"],
                ["expiry", "Quote validity (days)"],
                ["capacity", "Daily capacity (0 = not configured)"],
              ] as const
            ).map(([k, l]) => (
              <Field key={k} label={l}>
                <input
                  type="number"
                  min={k === "expiry" ? 1 : 0}
                  step={k === "capacity" || k === "expiry" ? 1 : 0.01}
                  required
                  value={s[k]}
                  onChange={(e) => S({ ...s, [k]: Number(e.target.value) })}
                />
              </Field>
            ))}
            {(
              [
                ["open", "Opening time"],
                ["close", "Weekday closing"],
                ["saturdayClose", "Saturday closing"],
              ] as const
            ).map(([k, l]) => (
              <Field key={k} label={l}>
                <input
                  required
                  type="time"
                  value={s[k]}
                  onChange={(e) => S({ ...s, [k]: e.target.value })}
                />
              </Field>
            ))}
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={s.sundayClosed}
              onChange={(e) => S({ ...s, sundayClosed: e.target.checked })}
            />
            Closed on Sundays
          </label>
          <Field label="Additional closed dates (YYYY-MM-DD, comma separated)">
            <input
              value={s.closed}
              onChange={(e) => S({ ...s, closed: e.target.value })}
              placeholder="2026-12-25, 2027-01-01"
            />
          </Field>
          <Field label="Email template (delivery not configured)">
            <textarea
              value={s.emailTemplate}
              onChange={(e) => S({ ...s, emailTemplate: e.target.value })}
            />
          </Field>
          <button className="button">
            Save settings <Check size={16} />
          </button>
        </form>
        <div>
          <section className="panel">
            <h2>Connections & backups</h2>
            {[
              "Database & secure staff login",
              "Payment integration",
              "Transactional email",
              "Daily scheduled backups",
              "Separate image backup",
            ].map((x) => (
              <div className="connection" key={x}>
                <span>{x}</span>
                <span className="badge">Not configured</span>
              </div>
            ))}
            <p className="quiet">
              Browser persistence is not a protected production database. JSON
              exports include embedded reference images; production image
              storage needs separate backup and restoration testing.
            </p>
            <button
              className="button secondary"
              onClick={() => {
                download(
                  "cakedesk-backup-" + day() + ".json",
                  JSON.stringify(
                    { version: 1, exportedAt: stamp(), data: db },
                    null,
                    2,
                  ),
                );
                notice("Backup file generated. Keep it in a safe place.");
              }}
            >
              <Download size={16} /> Download full local backup
            </button>
            <hr />
            <Field label="Restore a CakeDesk JSON export">
              <input
                type="file"
                accept="application/json,.json"
                onChange={(e) => read(e.target.files?.[0])}
              />
            </Field>
            {error && (
              <p role="alert" className="warning">
                {error}
              </p>
            )}
            {restore && (
              <>
                <p>{restore.orders.length} records validated for import.</p>
                <button
                  className="button"
                  onClick={() => {
                    if (
                      confirm(
                        "Replace all current local demo data with this backup?",
                      ) &&
                      save(restore)
                    ) {
                      S(restore.settings);
                      R(null);
                      notice("Backup restored to local storage.");
                    }
                  }}
                >
                  Restore validated backup
                </button>
              </>
            )}
          </section>
          <section className="panel">
            <h2>People & permissions</h2>
            <p>
              No staff accounts are connected. Individual authenticated accounts
              and server-side role policies are a production requirement.
            </p>
            {[
              ["Owner", "All functions and settings"],
              ["Manager", "Orders, pricing, production, reports"],
              ["Counter", "Intake, messages and pickup"],
              ["Baker", "Confirmed production and preparation"],
            ].map(([r, d]) => (
              <div className="connection" key={r}>
                <b>{r}</b>
                <small>{d}</small>
              </div>
            ))}
            <Link className="text-link" to="/staff/login">
              Switch fictional demo role <ArrowRight size={14} />
            </Link>
          </section>
          <section className="panel">
            <h2>If the internet goes down</h2>
            <p>
              Use numbered temporary paper forms. When access returns, enter
              each order, check the pickup date, and reconcile every number. Do
              not assume offline synchronization.
            </p>
            <p className="quiet">
              Before deployment, compare intake fields with the bakery’s actual
              paper form, configure secure access and test database and image
              restoration.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
