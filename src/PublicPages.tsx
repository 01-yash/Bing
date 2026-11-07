import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Flower2,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PublicHeader, PublicFooter, CakeArt } from "./PublicLayout";
import {
  createEnquiry,
  loadEnquiries,
  setEnquiryStatus,
  useEnquiries,
  type Enquiry,
  type EnquiryInput,
} from "./contactStore";
import { download } from "./model";
import "./public-pages.css";

const directions =
  "https://www.google.com/maps/search/?api=1&query=253+East+Main+Street+Newark+DE+19711";
const steps = [
  {
    n: "01",
    title: "A little inspiration",
    text: "Tell us the occasion, choose your flavors, and share a photo or a few words about your idea.",
  },
  {
    n: "02",
    title: "A real conversation",
    text: "Our team reviews the design, discusses what’s possible, and prepares a quote for your approval.",
  },
  {
    n: "03",
    title: "Your day, beautifully made",
    text: "Once the bakery confirms your order, your approved details stay together through preparation and pickup.",
  },
];

function Breadcrumb({ current }: { current: string }) {
  return (
    <div className="bakery-breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={12} />
      <span>{current}</span>
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bakery-page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}
function CakeChoices({ full = false }: { full?: boolean }) {
  return (
    <div
      className={"bakery-cake-grid " + (full ? "bakery-cake-grid-full" : "")}
    >
      <article className="bakery-cake-card">
        <Link
          to="/order?kind=classic"
          className="bakery-cake-picture"
          aria-label="Choose a classic cake"
        >
          <CakeArt />
          <span className="bakery-picture-label">
            THE EVERYDAY CELEBRATIONS
          </span>
        </Link>
        <div className="bakery-cake-copy">
          <span className="eyebrow">FAMILIAR, WITH YOUR OWN FINISH</span>
          <h2>A classic cake</h2>
          <p>
            Your favorite flavors, a thoughtful message, and a reason to gather.
            Start with a classic and make it your own.
          </p>
          {full && (
            <ul>
              <li>Choose size, flavor and filling</li>
              <li>Add your colors and inscription</li>
              <li>Review details with our bakery team</li>
            </ul>
          )}
          <Link className="bakery-arrow-link" to="/order?kind=classic">
            Choose your cake <ArrowRight size={17} />
          </Link>
        </div>
      </article>
      <article className="bakery-cake-card">
        <Link
          to="/order?kind=custom"
          className="bakery-cake-picture"
          aria-label="Request a custom design"
        >
          <CakeArt floral />
          <span className="bakery-picture-label">THE ONE-OF-A-KIND IDEAS</span>
        </Link>
        <div className="bakery-cake-copy">
          <span className="eyebrow">A LITTLE MORE YOU</span>
          <h2>Something custom</h2>
          <p>
            A special pattern, a favorite flower, an idea saved on your phone.
            Let’s turn the details you love into a conversation.
          </p>
          {full && (
            <ul>
              <li>Attach a reference photo and notes</li>
              <li>Review feasibility with a real baker</li>
              <li>Approve a personalized quote</li>
            </ul>
          )}
          <Link className="bakery-arrow-link" to="/order?kind=custom">
            Share your idea <ArrowRight size={17} />
          </Link>
        </div>
      </article>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <PublicHeader />
      <main className="bakery-public bakery-home">
        <section className="bakery-hero">
          <div className="bakery-hero-copy">
            <p className="eyebrow">
              <span className="bakery-tiny-flower">✳</span> A NEIGHBORHOOD
              BAKERY IN NEWARK
            </p>
            <h1>
              Have a cake
              <br />
              in mind<span>?</span>
            </h1>
            <p className="bakery-hero-description">
              For the big milestones. The little surprises.
              <br className="bakery-desktop-break" /> And everyone worth
              celebrating.
            </p>
            <p className="bakery-hero-small">
              Choose a favorite or share a one-of-a-kind idea. We’ll help you
              get every delicious detail just right.
            </p>
            <div className="bakery-hero-actions">
              <Link className="button" to="/order">
                Start your cake <ArrowRight size={17} />
              </Link>
              <Link className="bakery-arrow-link" to="/cakes">
                Explore our cakes <ArrowUpRight size={15} />
              </Link>
            </div>
            <p className="bakery-small-promise">
              <CheckCircle2 size={15} /> No account needed. Every request gets a
              human review.
            </p>
          </div>
          <div className="bakery-hero-display">
            <div className="bakery-art-frame">
              <CakeArt floral />
              <span className="bakery-art-script">
                A little joy, made by hand.
              </span>
              <span className="bakery-art-topline">
                BING’S BAKERY · NEWARK, DE
              </span>
            </div>
            <div className="bakery-hero-sticker">
              <Flower2 size={23} />
              <span>
                Your idea.
                <br />
                <b>Our kind of cake.</b>
              </span>
            </div>
            <span className="bakery-art-caption">
              ILLUSTRATED INSPIRATION · MADE TO BE YOURS
            </span>
          </div>
        </section>
        <div className="bakery-values-strip">
          <span>
            <Flower2 size={18} /> A design that feels like you
          </span>
          <span>
            <MessageCircle size={18} /> Real people, thoughtful details
          </span>
          <span>
            <MapPin size={18} /> Pick up in Newark, Delaware
          </span>
        </div>
        <section className="bakery-section">
          <div className="bakery-section-title">
            <div>
              <p className="eyebrow">A GOOD PLACE TO START</p>
              <h2>Every celebration has its cake.</h2>
            </div>
            <Link className="bakery-arrow-link" to="/cakes">
              Find your favorite <ArrowRight size={17} />
            </Link>
          </div>
          <CakeChoices />
        </section>
        <section className="bakery-process-preview">
          <div className="bakery-process-intro">
            <span className="bakery-round-icon">
              <Sparkles size={22} />
            </span>
            <p className="eyebrow">THOUGHTFULLY MADE. SIMPLY ORDERED.</p>
            <h2>
              From a little idea
              <br />
              to the first slice.
            </h2>
            <Link className="bakery-arrow-link" to="/how-it-works">
              See how it works <ArrowRight size={17} />
            </Link>
          </div>
          <div className="bakery-process-list">
            {steps.map((s) => (
              <div key={s.n}>
                <span>{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bakery-contact-ribbon">
          <div>
            <p className="eyebrow">SOME THINGS ARE EASIER TO TALK THROUGH</p>
            <h2>Have a question before you order?</h2>
            <p>We’re happy to help with the details.</p>
          </div>
          <Link className="button secondary" to="/contact">
            Get in touch <MessageCircle size={17} />
          </Link>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

export function CakesPage() {
  return (
    <>
      <PublicHeader />
      <main className="bakery-public">
        <Breadcrumb current="Our cakes" />
        <PageHeading
          eyebrow="FOR EVERY KIND OF CELEBRATION"
          title="A cake to make it yours."
        >
          A familiar favorite or a design that starts with a sketch. Choose your
          starting point; our bakery team will help with the rest.
        </PageHeading>
        <CakeChoices full />
        <section className="bakery-occasion-note">
          <Flower2 size={38} />
          <div>
            <p className="eyebrow">WEDDINGS & SOMETHING EXTRA SPECIAL</p>
            <h2>Big plans deserve a conversation.</h2>
            <p>
              Planning a wedding, a larger gathering, or a particularly detailed
              design? Share your inspiration in a custom request, or ask a
              question before getting started.
            </p>
            <div className="bakery-inline-actions">
              <Link className="bakery-arrow-link" to="/order?kind=custom">
                Start a custom request <ArrowRight size={16} />
              </Link>
              <Link className="bakery-arrow-link" to="/contact">
                Talk to the bakery <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <div className="bakery-guidance-grid">
          <div>
            <span className="bakery-round-icon">
              <MessageCircle size={20} />
            </span>
            <h3>A quote, with a human touch</h3>
            <p>
              Prices depend on size, design and decoration. The bakery reviews
              every request before confirming the final price.
            </p>
          </div>
          <div>
            <span className="bakery-round-icon">
              <ShieldCheck size={20} />
            </span>
            <h3>Made clear before it’s made</h3>
            <p>
              Your approved design, quote and pickup details stay in one
              CakeCard. A request alone doesn’t reserve a pickup.
            </p>
          </div>
          <div>
            <span className="bakery-round-icon">
              <Flower2 size={20} />
            </span>
            <h3>A note on ingredients</h3>
            <p>
              Please share any dietary or allergy concerns. Availability and
              ingredient requirements need direct bakery confirmation.
            </p>
          </div>
        </div>
        <p className="bakery-demo-caption">
          Illustrations show design ideas, not a live product catalog. Options
          and prices in this competition demonstration are examples.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}

export function HowItWorksPage() {
  return (
    <>
      <PublicHeader />
      <main className="bakery-public">
        <Breadcrumb current="How it works" />
        <PageHeading
          eyebrow="FROM YOUR FIRST IDEA TO PICKUP"
          title="A little care at every step."
        >
          Custom doesn’t have to mean complicated. Tell us what you’re dreaming
          of, and we’ll work through the possibilities together.
        </PageHeading>
        <section className="bakery-full-process">
          {steps.map((s, i) => (
            <article key={s.n}>
              <span className="bakery-process-number">{s.n}</span>
              <div>
                <p className="eyebrow">
                  {
                    [
                      "SHARE YOUR VISION",
                      "GET THE DETAILS RIGHT",
                      "LET THE CELEBRATING BEGIN",
                    ][i]
                  }
                </p>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <ul>
                  {[
                    [
                      "Choose an occasion and requested pickup date.",
                      "Pick your cake flavors, size and filling.",
                      "Add a photo, inscription or specific design notes.",
                    ],
                    [
                      "Ask questions and reply from your private demo CakeCard.",
                      "Review the exact design and staff-prepared quote.",
                      "Approve the quote; the bakery checks its confirmation conditions.",
                    ],
                    [
                      "Check the confirmed pickup date and time on your CakeCard.",
                      "Ask about changes before the team starts preparing your cake.",
                      "Pick up your cake at 253 East Main Street in Newark.",
                    ],
                  ][i].map((item) => (
                    <li key={item}>
                      <Check size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
        <section className="bakery-faq">
          <div>
            <p className="eyebrow">A FEW GOOD QUESTIONS</p>
            <h2>Before you start.</h2>
            <p>
              Need a little more help?
              <br />
              <Link className="bakery-arrow-link" to="/contact">
                Talk to us <ArrowRight size={16} />
              </Link>
            </p>
          </div>
          <div>
            {[
              [
                "Is my cake confirmed as soon as I submit?",
                "Not yet. Your request first goes to the bakery for review. The team confirms your design, final quote and pickup details after the necessary approvals and any required deposit verification.",
              ],
              [
                "Can I share a reference photo?",
                "Yes. Upload a JPG, PNG or WebP image up to 2 MB in the cake request form. You can place numbered notes on the photo to explain a color, decoration or detail. References guide a conversation; they are not a guarantee of an exact reproduction.",
              ],
              [
                "Can I order by phone or in person?",
                "Of course. Call 302-737-5310 or visit the bakery. Staff can enter phone and counter orders into the same order record, keeping your design and pickup details together.",
              ],
              [
                "What if I need to change an approved design?",
                "Use your CakeCard to request a change. The last approved instructions stay on record while staff reviews the proposed revision and sends a new quote for approval.",
              ],
              [
                "Can I pay on this website?",
                "Payment integration is not configured in this demonstration. Payment is handled through the bakery’s existing process; no card information is collected here.",
              ],
              [
                "Will this demo send emails to the bakery?",
                "No. This competition demonstration stores orders and contact enquiries on this browser only. A real shared database, secure staff accounts and email delivery must be connected before live use. For an actual enquiry, call the bakery.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="bakery-start-banner">
          <Flower2 size={32} />
          <div>
            <h2>Let’s start with your idea.</h2>
            <p>A few details now. Something to look forward to next.</p>
          </div>
          <Link className="button" to="/order">
            Start your cake <ArrowRight size={16} />
          </Link>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

const emptyForm: EnquiryInput = {
  name: "",
  email: "",
  phone: "",
  topic: "General question",
  orderReference: "",
  message: "",
};
export function ContactPage() {
  const [form, setForm] = useState<EnquiryInput>(emptyForm);
  const [accepted, setAccepted] = useState(false);
  const [saved, setSaved] = useState<Enquiry | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const update = (key: keyof EnquiryInput, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;
    if (!accepted) {
      setError("Please acknowledge the local demonstration before saving.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      setSaved(createEnquiry(form));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "The message could not be saved. Check browser storage and try again.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <PublicHeader />
      <main className="bakery-public">
        <Breadcrumb current="Contact" />
        <PageHeading
          eyebrow="A QUESTION, AN IDEA, A REASON TO SAY HELLO"
          title="Let’s talk cake. And the details."
        >
          Not sure where to start? Ask about a design, an upcoming celebration,
          or an existing request. We’re happy to help you find your next step.
        </PageHeading>
        <div className="bakery-contact-layout">
          <div className="bakery-contact-details">
            <div className="bakery-contact-title">
              <Flower2 size={33} />
              <h2>Come say hello.</h2>
            </div>
            <div className="bakery-contact-fact">
              <MapPin size={20} />
              <div>
                <h3>Find the bakery</h3>
                <p>
                  Bing’s Bakery
                  <br />
                  253 East Main Street
                  <br />
                  Newark, DE 19711
                </p>
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="bakery-arrow-link"
                >
                  Get directions <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="bakery-contact-fact">
              <Phone size={19} />
              <div>
                <h3>Give us a call</h3>
                <a className="bakery-phone" href="tel:3027375310">
                  302-737-5310
                </a>
                <p>
                  A real order or time-sensitive question?
                  <br />
                  Calling is the best place to start.
                </p>
              </div>
            </div>
            <div className="bakery-contact-fact">
              <Clock3 size={20} />
              <div>
                <h3>Regular bakery hours</h3>
                <dl className="bakery-hours">
                  <div>
                    <dt>Monday–Friday</dt>
                    <dd>7 AM–6 PM</dd>
                  </div>
                  <div>
                    <dt>Saturday</dt>
                    <dd>7 AM–5 PM</dd>
                  </div>
                  <div>
                    <dt>Sunday</dt>
                    <dd>Closed</dd>
                  </div>
                </dl>
                <p className="bakery-fineprint">
                  Holiday hours may differ. Please call to confirm.
                </p>
              </div>
            </div>
            <div className="bakery-contact-help">
              <h3>Already have a cake idea?</h3>
              <p>
                The cake request form keeps your design, reference photo and
                pickup preferences together.
              </p>
              <Link className="bakery-arrow-link" to="/order">
                Start a cake request <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <section className="bakery-contact-form-card">
            {saved ? (
              <div className="bakery-contact-success" role="status">
                <span>
                  <CheckCircle2 size={29} />
                </span>
                <p className="eyebrow">ONE MORE DETAIL, SAFELY TOGETHER</p>
                <h2>Your message is saved.</h2>
                <p>
                  Your demo enquiry <strong>{saved.id}</strong> is now in the
                  staff Contact inbox on this browser.
                </p>
                <div className="bakery-local-notice">
                  No email was sent to Bing’s Bakery. For a real enquiry, please
                  call <a href="tel:3027375310">302-737-5310</a>.
                </div>
                <button
                  className="button secondary"
                  onClick={() => {
                    setSaved(null);
                    setForm(emptyForm);
                    setAccepted(false);
                  }}
                >
                  Write another message <ArrowRight size={16} />
                </button>
                <Link className="bakery-arrow-link" to="/">
                  Back to the bakery
                </Link>
              </div>
            ) : (
              <>
                <p className="eyebrow">WE’RE LISTENING</p>
                <h2>Leave us a note.</h2>
                <p className="bakery-form-intro">
                  Use fictional details to try the contact flow. Demo messages
                  are saved locally for the staff inbox; they aren’t emailed to
                  the bakery.
                </p>
                <form onSubmit={submit}>
                  <div className="bakery-form-grid">
                    <label className="field">
                      <span>Your name</span>
                      <input
                        required
                        autoComplete="name"
                        maxLength={100}
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Email address</span>
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Phone number (optional)</span>
                      <input
                        type="tel"
                        autoComplete="tel"
                        maxLength={80}
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>What can we help with?</span>
                      <select
                        value={form.topic}
                        onChange={(e) => update("topic", e.target.value)}
                      >
                        {[
                          "General question",
                          "Custom cake",
                          "Wedding or event",
                          "Existing request",
                        ].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="field">
                    <span>Order reference (optional)</span>
                    <input
                      maxLength={80}
                      placeholder="For example, B-1042"
                      value={form.orderReference}
                      onChange={(e) => update("orderReference", e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Your message</span>
                    <textarea
                      required
                      maxLength={4000}
                      rows={6}
                      placeholder="Tell us a little about what you have in mind…"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </label>
                  <label className="check">
                    <input
                      required
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                    />
                    I understand this is a local demonstration and no email will
                    be sent.
                  </label>
                  {error && (
                    <p className="bakery-form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="bakery-submit-line">
                    <span>
                      <ShieldCheck size={15} /> Please use fictional
                      information.
                    </span>
                    <button className="button" disabled={busy}>
                      {busy ? "Saving…" : "Save demo message"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}

export function ContactInbox() {
  const { items, error } = useEnquiries();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Open");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const matches = items.filter(
    (item) =>
      (filter === "All" || item.status === filter) &&
      [
        item.id,
        item.name,
        item.email,
        item.topic,
        item.orderReference,
        item.message,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const selected = items.find((item) => item.id === selectedId);
  function setStatus(item: Enquiry) {
    try {
      setEnquiryStatus(item.id, item.status === "Open" ? "Resolved" : "Open");
      setActionError("");
      setNotice(
        item.status === "Open"
          ? "Enquiry marked resolved."
          : "Enquiry reopened.",
      );
    } catch (e) {
      setActionError(
        e instanceof Error
          ? e.message
          : "The update could not be saved. Please retry.",
      );
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">KEEP THE CONVERSATION TOGETHER</p>
          <h1>Contact enquiries</h1>
          <p className="muted">
            Questions from the contact page, ready for a thoughtful follow-up.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            try {
              download(
                "bings-bakery-enquiries.json",
                JSON.stringify(
                  {
                    version: 1,
                    exportedAt: new Date().toISOString(),
                    enquiries: loadEnquiries(),
                  },
                  null,
                  2,
                ),
              );
              setNotice("Enquiry export file generated.");
            } catch {
              setActionError(
                "The enquiry export could not be generated. Check browser storage and try again.",
              );
            }
          }}
        >
          <Download size={16} /> Export enquiries
        </button>
      </div>
      <div className="bakery-local-notice">
        Local demo inbox · Messages stay on this browser. No email delivery or
        external replies are configured. Contact enquiries have a separate
        export from cake orders.
      </div>
      {(error || actionError) && (
        <p className="bakery-form-error" role="alert">
          {error || actionError}
        </p>
      )}
      {notice && (
        <p className="bakery-inbox-notice" role="status">
          <CheckCircle2 size={16} />
          {notice}
        </p>
      )}
      <div className="bakery-inbox-grid">
        <section className="panel bakery-inbox-list">
          <div className="bakery-inbox-filters">
            <label className="search">
              <Search size={16} />
              <input
                aria-label="Search contact enquiries"
                placeholder="Search name, reference or message…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Filter contact enquiries"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Open</option>
              <option>Resolved</option>
              <option>All</option>
            </select>
          </div>
          {matches.length ? (
            matches.map((item) => (
              <button
                key={item.id}
                className={
                  "bakery-enquiry-row " +
                  (selectedId === item.id ? "bakery-enquiry-selected" : "")
                }
                aria-label={"Open enquiry from " + item.name}
                aria-pressed={selectedId === item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  setNotice("");
                }}
              >
                <div>
                  <b>{item.name}</b>
                  <span
                    className={
                      "bakery-enquiry-status " + item.status.toLowerCase()
                    }
                  >
                    {item.status}
                  </span>
                </div>
                <strong>{item.topic}</strong>
                <p>{item.message}</p>
                <small>
                  {new Date(item.createdAt).toLocaleDateString()} · {item.id}
                </small>
              </button>
            ))
          ) : (
            <div className="bakery-inbox-empty">
              <MessageCircle size={28} />
              <h2>
                {query || filter !== "Open"
                  ? "No matching enquiries."
                  : "A little room to listen."}
              </h2>
              <p>
                {query
                  ? "Try another name, reference or keyword."
                  : "Contact form submissions will appear here. Try it with fictional information on the customer website."}
              </p>
              <Link className="bakery-arrow-link" to="/contact">
                Open contact form <ArrowUpRight size={15} />
              </Link>
            </div>
          )}
        </section>
        <section className="panel bakery-enquiry-detail">
          {selected ? (
            <>
              <div className="bakery-enquiry-detail-heading">
                <p className="eyebrow">{selected.id}</p>
                <span
                  className={
                    "bakery-enquiry-status " + selected.status.toLowerCase()
                  }
                >
                  {selected.status}
                </span>
              </div>
              <h2>{selected.topic}</h2>
              <dl>
                <div>
                  <dt>From</dt>
                  <dd>{selected.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{selected.email}</dd>
                </div>
                {selected.phone && (
                  <div>
                    <dt>Phone</dt>
                    <dd>{selected.phone}</dd>
                  </div>
                )}
                {selected.orderReference && (
                  <div>
                    <dt>Order reference</dt>
                    <dd>{selected.orderReference}</dd>
                  </div>
                )}
                <div>
                  <dt>Received</dt>
                  <dd>{new Date(selected.createdAt).toLocaleString()}</dd>
                </div>
              </dl>
              <div className="bakery-enquiry-body">{selected.message}</div>
              {selected.resolvedAt && (
                <p className="quiet">
                  Resolved {new Date(selected.resolvedAt).toLocaleString()}
                </p>
              )}
              <button className="button" onClick={() => setStatus(selected)}>
                {selected.status === "Open"
                  ? "Mark resolved"
                  : "Reopen enquiry"}
                <Check size={16} />
              </button>
              <p className="quiet">
                This updates the local record only. No reply or notification is
                sent.
              </p>
            </>
          ) : (
            <div className="bakery-inbox-empty">
              <MessageCircle size={28} />
              <h2>Give the details a little attention.</h2>
              <p>
                Select an enquiry to read the message and update its status.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
