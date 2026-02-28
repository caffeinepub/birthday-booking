import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  Cake,
  CalendarDays,
  CheckCircle2,
  Clock,
  Home,
  Mail,
  MessageSquare,
  Package,
  PartyPopper,
  Phone,
  SearchCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { Status, useBooking, usePackages } from "../hooks/useQueries";

// ── Status badge ───────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  if (status === Status.confirmed) {
    return (
      <span className="status-confirmed inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-ui font-semibold">
        <CheckCircle2 className="w-4 h-4" />
        Confirmed
      </span>
    );
  }
  if (status === Status.cancelled) {
    return (
      <span className="status-cancelled inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-ui font-semibold">
        <XCircle className="w-4 h-4" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="status-pending inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-ui font-semibold">
      <Clock className="w-4 h-4" />
      Pending Review
    </span>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div className="font-body text-foreground font-medium break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

function BookingDetailsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }, (_, i) => `detail-sk-${i}`).map((id) => (
        <div key={id} className="flex items-center gap-3 py-3">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ConfirmationPage() {
  const { bookingId } = useParams({ strict: false }) as { bookingId: string };
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const { data: packages } = usePackages();

  const packageName = booking
    ? (packages?.find((p) => p.id === booking.packageId)?.name ??
      booking.packageId)
    : "";

  const formattedDate = booking?.partyDate
    ? new Date(booking.partyDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const createdDate = booking?.createdAt
    ? new Date(Number(booking.createdAt) / 1_000_000).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
    : "";

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Header */}
      <div className="bg-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-60" />
        <div className="relative z-10 container max-w-2xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {!isLoading && booking && (
              <>
                <div className="text-6xl mb-4">
                  {booking.status === Status.confirmed
                    ? "🎉"
                    : booking.status === Status.cancelled
                      ? "😔"
                      : "🎂"}
                </div>
                <h1 className="font-display font-black text-4xl sm:text-5xl mb-2">
                  {booking.status === Status.confirmed
                    ? "Booking Confirmed!"
                    : booking.status === Status.cancelled
                      ? "Booking Cancelled"
                      : "Booking Received!"}
                </h1>
                <p className="text-white/70 font-body text-lg">
                  {booking.status === Status.confirmed
                    ? "Get ready to celebrate — your party is locked in!"
                    : booking.status === Status.cancelled
                      ? "This booking has been cancelled."
                      : "We've received your booking and will confirm it shortly."}
                </p>
              </>
            )}
            {isLoading && (
              <>
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4 bg-white/20" />
                <Skeleton className="h-10 w-64 mx-auto mb-2 bg-white/20" />
                <Skeleton className="h-5 w-80 mx-auto bg-white/20" />
              </>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-10">
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Booking Not Found
            </h2>
            <p className="text-muted-foreground font-body mb-6">
              We couldn't find a booking with ID:{" "}
              <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
                {bookingId}
              </code>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/my-bookings">
                <Button variant="outline" className="font-ui">
                  <SearchCheck className="w-4 h-4 mr-2" />
                  Find My Bookings
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-party-gradient text-white font-ui">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {!isError && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Booking ID + Status card */}
            <div className="bg-card rounded-3xl border border-border shadow-party overflow-hidden">
              <div className="p-6 bg-secondary/40 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Booking Reference
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-48" />
                  ) : (
                    <code className="font-mono text-sm font-bold text-foreground bg-muted px-2 py-1 rounded">
                      {booking?.id}
                    </code>
                  )}
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-28 rounded-full" />
                ) : booking ? (
                  <StatusBadge status={booking.status} />
                ) : null}
              </div>

              {/* Details */}
              <div className="p-6">
                {isLoading ? (
                  <BookingDetailsSkeleton />
                ) : booking ? (
                  <div>
                    <DetailRow
                      icon={User2}
                      label="Guest of Honor"
                      value={booking.customerName}
                    />
                    <DetailRow
                      icon={Mail}
                      label="Email"
                      value={booking.email}
                    />
                    <DetailRow
                      icon={Phone}
                      label="Phone"
                      value={booking.phone}
                    />
                    <DetailRow
                      icon={CalendarDays}
                      label="Party Date"
                      value={formattedDate || booking.partyDate}
                    />
                    <DetailRow
                      icon={Users}
                      label="Number of Guests"
                      value={`${Number(booking.numberOfGuests)} guests`}
                    />
                    <DetailRow
                      icon={Package}
                      label="Package"
                      value={packageName}
                    />
                    {booking.specialRequests && (
                      <DetailRow
                        icon={MessageSquare}
                        label="Special Requests"
                        value={booking.specialRequests}
                      />
                    )}
                    {createdDate && (
                      <DetailRow
                        icon={Clock}
                        label="Booking Created"
                        value={createdDate}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Status info */}
            {!isLoading && booking?.status === Status.pending && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3 p-4 bg-secondary/60 rounded-2xl border border-border"
              >
                <div className="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-ui font-semibold text-foreground text-sm mb-0.5">
                    Awaiting Confirmation
                  </div>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    Our team will review your booking and send a confirmation to{" "}
                    <strong>{booking.email}</strong> within 24 hours.
                  </p>
                </div>
              </motion.div>
            )}

            {!isLoading && booking?.status === Status.confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3 p-4 rounded-2xl border"
                style={{
                  background: "oklch(0.96 0.04 145 / 0.3)",
                  borderColor: "oklch(0.70 0.12 145 / 0.4)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.70 0.14 145 / 0.15)" }}
                >
                  <CheckCircle2
                    className="w-5 h-5"
                    style={{ color: "oklch(0.30 0.12 145)" }}
                  />
                </div>
                <div>
                  <div
                    className="font-ui font-semibold text-sm mb-0.5"
                    style={{ color: "oklch(0.25 0.10 145)" }}
                  >
                    You're all set!
                  </div>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "oklch(0.35 0.08 145)" }}
                  >
                    Your birthday party is confirmed. Get ready for an amazing
                    celebration!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/my-bookings" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full font-ui h-11 rounded-xl"
                >
                  <SearchCheck className="w-4 h-4 mr-2" />
                  Find My Bookings
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full bg-party-gradient hover:opacity-90 text-white font-ui font-semibold h-11 rounded-xl">
                  <Cake className="w-4 h-4 mr-2" />
                  Plan Another Party
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper icon component for the detail rows
import { User as User2 } from "lucide-react";
