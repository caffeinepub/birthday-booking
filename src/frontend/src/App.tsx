import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { Cake, Menu, PartyPopper, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import AdminPage from "./pages/AdminPage";
import BookingFormPage from "./pages/BookingFormPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import LandingPage from "./pages/LandingPage";
import MyBookingsPage from "./pages/MyBookingsPage";

// ── Nav links ─────────────────────────────────────────
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/book", label: "Book a Party" },
  { to: "/my-bookings", label: "My Bookings" },
  { to: "/admin", label: "Admin" },
];

// ── Root layout ───────────────────────────────────────
function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="Celebrate! Birthday Bookings - Home"
          >
            <div className="w-9 h-9 rounded-xl bg-party-gradient flex items-center justify-center shadow-party group-hover:scale-105 transition-transform">
              <Cake className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground leading-none">
              Cele<span className="text-primary">brate!</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg text-sm font-ui font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:text-primary [&.active]:bg-secondary"
                activeProps={{ className: "active" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/book">
              <Button
                size="sm"
                className="ml-2 bg-party-gradient hover:opacity-90 text-white font-ui font-semibold shadow-party transition-opacity"
              >
                <PartyPopper className="w-4 h-4 mr-1.5" />
                Book Now
              </Button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden border-t border-border bg-card overflow-hidden"
            >
              <nav
                className="container px-4 py-3 flex flex-col gap-1"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-3 rounded-lg text-sm font-ui font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:text-primary [&.active]:bg-secondary"
                    activeProps={{ className: "active" }}
                    activeOptions={{ exact: link.to === "/" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full mt-2 bg-party-gradient hover:opacity-90 text-white font-ui font-semibold">
                    <PartyPopper className="w-4 h-4 mr-1.5" />
                    Book Now
                  </Button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background/80 py-8 mt-auto">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-party-gradient flex items-center justify-center">
                <Cake className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-background/90">
                Celebrate!
              </span>
            </div>
            <p className="text-sm text-background/60 text-center">
              Making every birthday unforgettable
            </p>
            <p className="text-xs text-background/50">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background/80 transition-colors underline-offset-2 hover:underline"
              >
                Built with ♥ using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
}

// ── Routes ────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookingFormPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmation/$bookingId",
  component: ConfirmationPage,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  bookRoute,
  confirmationRoute,
  myBookingsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

// Export useNavigate for use in pages
export { useNavigate };
