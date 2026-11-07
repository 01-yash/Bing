import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Flower2,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Bing's Bakery home">
      <span className="brand-icon">
        <ChefHat size={25} aria-hidden="true" />
      </span>
      <span>
        Bing’s <b>Bakery</b>
        <small>BAKED WITH CARE · NEWARK, DE</small>
      </span>
    </Link>
  );
}

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="public-header bakery-header">
      <Brand />
      <button
        type="button"
        className="public-menu-button icon-button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="public-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="public-navigation"
        aria-label="Main navigation"
        className={open ? "is-open" : ""}
      >
        <NavLink to="/" end onClick={() => setOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/cakes" onClick={() => setOpen(false)}>
          Custom cakes
        </NavLink>
        <NavLink to="/how-it-works" onClick={() => setOpen(false)}>
          How it works
        </NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)}>
          Contact
        </NavLink>
        <NavLink
          className="button small"
          to="/order"
          onClick={() => setOpen(false)}
        >
          Start a cake order <ArrowUpRight size={15} />
        </NavLink>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bakery-footer">
      <div className="bakery-footer-top">
        <div>
          <Brand />
          <p>
            A little thought. A lot of heart.
            <br />
            Something wonderful to celebrate.
          </p>
        </div>
        <div>
          <h3>Come say hello</h3>
          <a
            href="https://www.google.com/maps/search/?api=1&query=253+East+Main+Street+Newark+DE+19711"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin size={15} />
            253 East Main Street
            <br />
            Newark, DE 19711 <ArrowUpRight size={13} />
          </a>
          <a href="tel:3027375310">
            <Phone size={15} />
            302-737-5310
          </a>
        </div>
        <div>
          <h3>From our bakery</h3>
          <Link to="/cakes">Explore custom cakes</Link>
          <Link to="/how-it-works">How ordering works</Link>
          <Link to="/contact">
            Contact the bakery <ArrowRight size={13} />
          </Link>
        </div>
        <div>
          <h3>Bakery hours</h3>
          <p>
            Monday–Friday <b>7 AM–6 PM</b>
            <br />
            Saturday <b>7 AM–5 PM</b>
            <br />
            Sunday <b>Closed</b>
          </p>
          <Link to="/staff/login">
            Staff workspace <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
      <div className="bakery-footer-bottom">
        <span>
          © {new Date().getFullYear()} Bing’s Bakery · Website demonstration
        </span>
        <span>Every cake request is subject to bakery approval.</span>
        <Link to="/demo">
          Explore the demo <ArrowUpRight size={12} />
        </Link>
      </div>
    </footer>
  );
}

export function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    const publicTitles: Record<string, string> = {
      "/": "",
      "/cakes": "Custom cakes",
      "/how-it-works": "How it works",
      "/contact": "Contact",
      "/order": "Start your cake",
      "/order/confirmation": "Request received",
      "/demo": "Explore the demo",
      "/staff/login": "Staff sign in",
      "/staff": "Order overview",
      "/staff/orders": "All cake orders",
      "/staff/orders/new": "New cake order",
      "/staff/quotes": "Quotes",
      "/staff/messages": "Contact inbox",
      "/staff/production": "Production",
      "/staff/calendar": "Pickup calendar",
      "/staff/reports": "Bakery reports",
      "/staff/settings": "Workspace settings",
    };
    const path = pathname.replace(/\/+$/, "") || "/";
    const title =
      publicTitles[path] ??
      (pathname.startsWith("/request/")
        ? "Your CakeCard"
        : pathname.startsWith("/staff/orders/")
          ? "CakeCard"
          : "Page not found");
    document.title = title ? `${title} | Bing's Bakery` : "Bing's Bakery";
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export function CakeArt({ floral = false }: { floral?: boolean }) {
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
