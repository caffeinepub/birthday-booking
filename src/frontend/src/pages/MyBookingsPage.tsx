import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  Package,
  PartyPopper,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Booking } from "../backend.d";
import { Status, useBookingsByEmail, usePackages } from "../hooks/useQueries";

function StatusBadge({ status }: { status: Status }) {
  if (status === Status.confirmed) {
    return (
      <span className="status-confirmed inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-ui font-semibold">
        <CheckCircle2 className="w-3 h-3" />
        Confirmed
      </span>
    );
  }
  if (status === Status.cancelled) {
    return (
      <span className="status-cancelled inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-ui font-semibold">
        <XCircle className="w-3 h-3" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="status-pending inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-ui font-semibold">
      <Clock className="w-3 h-3" />
      Pending
    </span>
  );
}

function BookingCard({
  booking,
  packageName,
}: {
  booking: Booking;
  packageName: string;
}) {
  const formattedDate = new Date(booking.partyDate).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-card rounded-2xl border border-border shadow-xs hover:shadow-party transition-all p-5 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <StatusBadge status={booking.status} />
            <span className="text-xs text-muted-foreground font-mono">
              #{booking.id.slice(0, 8)}…
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground font-ui">
                  Party Date
                </div>
                <div className="font-body font-medium text-foreground">
                  {formattedDate}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground font-ui">
                  Package
                </div>
                <div className="font-body font-medium text-foreground">
                  {packageName}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground font-ui">
                  Guests
                </div>
                <div className="font-body font-medium text-foreground">
                  {Number(booking.numberOfGuests)} guests
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link to="/confirmation/$bookingId" params={{ bookingId: booking.id }}>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground hover:text-foreground group-hover:text-primary transition-colors font-ui"
            aria-label={`View details for booking ${booking.id}`}
          >
            Details
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const [emailInput, setEmailInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const {
    data: bookings,
    isLoading,
    isFetching,
    isError,
  } = useBookingsByEmail(searchEmail);
  const { data: packages } = usePackages();

  const hasSearched = searchEmail.length > 0;
  const isSearching = (isLoading || isFetching) && hasSearched;
  const showResults = hasSearched && !isSearching;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = emailInput.trim().toLowerCase();
    if (trimmed) setSearchEmail(trimmed);
  }

  function getPackageName(packageId: string) {
    return packages?.find((p) => p.id === packageId)?.name ?? packageId;
  }

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Header */}
      <div className="bg-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-60" />
        <div className="relative z-10 container max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-party-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-party">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-2">
              My Bookings
            </h1>
            <p className="text-white/70 font-body text-lg">
              Enter your email to find all your party bookings
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-10">
        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-3xl border border-border shadow-party p-6 sm:p-8 mb-8"
        >
          <form onSubmit={handleSearch} noValidate>
            <Label
              htmlFor="lookupEmail"
              className="font-ui font-semibold text-foreground mb-2 block"
            >
              Email Address
            </Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="lookupEmail"
                  type="email"
                  placeholder="sarah@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-10 h-11 font-body"
                  autoComplete="email"
                  aria-label="Email address to look up bookings"
                />
              </div>
              <Button
                type="submit"
                disabled={!emailInput.trim() || isSearching}
                className="h-11 px-6 bg-party-gradient hover:opacity-90 text-white font-ui font-semibold shrink-0 transition-opacity"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Loading skeletons */}
        {isSearching && (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => `bk-sk-${i}`).map((id) => (
              <BookingCardSkeleton key={id} />
            ))}
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {showResults && !isError && (
            <motion.div
              key={searchEmail}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-display font-bold text-lg text-foreground">
                      {bookings.length} booking
                      {bookings.length !== 1 ? "s" : ""} found
                    </h2>
                    <span className="text-sm text-muted-foreground font-body truncate max-w-[200px]">
                      for {searchEmail}
                    </span>
                  </div>
                  {bookings
                    .slice()
                    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                    .map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        packageName={getPackageName(booking.packageId)}
                      />
                    ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="text-5xl mb-4">🎈</div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    No bookings found
                  </h3>
                  <p className="text-muted-foreground font-body mb-6 max-w-sm mx-auto">
                    We couldn't find any bookings for{" "}
                    <strong>{searchEmail}</strong>. Make sure you've entered the
                    right email address.
                  </p>
                  <Link to="/book">
                    <Button className="bg-party-gradient hover:opacity-90 text-white font-ui font-semibold">
                      <PartyPopper className="w-4 h-4 mr-2" />
                      Book a Party
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}

          {showResults && isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-3">😕</div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Search failed
              </h3>
              <p className="text-muted-foreground font-body mb-4">
                Something went wrong. Please try again.
              </p>
              <Button
                onClick={() => setSearchEmail(emailInput.trim())}
                variant="outline"
                className="font-ui"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {!hasSearched && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Find Your Bookings
              </h3>
              <p className="text-muted-foreground font-body max-w-sm mx-auto">
                Enter the email address you used when booking to view all your
                party reservations.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
