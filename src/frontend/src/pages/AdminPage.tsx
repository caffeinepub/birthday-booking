import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Loader2,
  MoreVertical,
  RefreshCw,
  Settings,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Booking } from "../backend.d";
import {
  Status,
  useAllBookings,
  usePackages,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

// ── Status badge ──────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  if (status === Status.confirmed) {
    return (
      <span className="status-confirmed inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-ui font-semibold whitespace-nowrap">
        <CheckCircle2 className="w-3 h-3" />
        Confirmed
      </span>
    );
  }
  if (status === Status.cancelled) {
    return (
      <span className="status-cancelled inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-ui font-semibold whitespace-nowrap">
        <XCircle className="w-3 h-3" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="status-pending inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-ui font-semibold whitespace-nowrap">
      <Clock className="w-3 h-3" />
      Pending
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}22` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="font-display font-black text-3xl text-foreground leading-none">
          {value}
        </div>
        <div className="text-sm font-ui text-muted-foreground mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Table row skeleton ────────────────────────────────
function TableRowSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 7 }, (_, i) => `tr-sk-${i}`).map((id) => (
        <TableCell key={id}>
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

type SortField = "partyDate" | "customerName" | "createdAt";
type SortDir = "asc" | "desc";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"all" | Status>("all");
  const [sortField, setSortField] = useState<SortField>("partyDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: bookings, isLoading, refetch, isFetching } = useAllBookings();
  const { data: packages } = usePackages();
  const updateStatus = useUpdateBookingStatus();

  function getPackageName(packageId: string) {
    return packages?.find((p) => p.id === packageId)?.name ?? packageId;
  }

  // Stats
  const stats = useMemo(() => {
    const all = bookings ?? [];
    return {
      total: all.length,
      pending: all.filter((b) => b.status === Status.pending).length,
      confirmed: all.filter((b) => b.status === Status.confirmed).length,
      cancelled: all.filter((b) => b.status === Status.cancelled).length,
    };
  }, [bookings]);

  // Filter + sort
  const displayedBookings = useMemo(() => {
    let list = (bookings ?? []).filter(
      (b) => activeTab === "all" || b.status === activeTab,
    );

    list = list.slice().sort((a, b) => {
      let cmp = 0;
      if (sortField === "partyDate") {
        cmp = a.partyDate.localeCompare(b.partyDate);
      } else if (sortField === "customerName") {
        cmp = a.customerName.localeCompare(b.customerName);
      } else if (sortField === "createdAt") {
        cmp = Number(a.createdAt) - Number(b.createdAt);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [bookings, activeTab, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  async function handleUpdateStatus(booking: Booking, newStatus: Status) {
    if (booking.status === newStatus) return;
    setUpdatingId(booking.id);
    try {
      await updateStatus.mutateAsync({ id: booking.id, status: newStatus });
      toast.success(
        `Booking ${newStatus === Status.confirmed ? "confirmed" : "cancelled"} successfully`,
      );
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/40" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-primary" />
    );
  }

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Header */}
      <div className="bg-foreground py-10 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-50" />
        <div className="relative z-10 container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-party-gradient rounded-xl flex items-center justify-center shadow-party">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-black text-3xl">
                  Admin Dashboard
                </h1>
                <p className="text-white/60 font-body text-sm">
                  Manage all party bookings
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-ui bg-white/5"
            >
              {isFetching ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isLoading ? (
            Array.from({ length: 4 }, (_, i) => `stat-sk-${i}`).map((id) => (
              <div
                key={id}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : (
            <>
              <StatCard
                label="Total Bookings"
                value={stats.total}
                icon={Users}
                color="oklch(0.50 0.12 260)"
              />
              <StatCard
                label="Pending"
                value={stats.pending}
                icon={Clock}
                color="oklch(0.60 0.14 70)"
              />
              <StatCard
                label="Confirmed"
                value={stats.confirmed}
                icon={CheckCircle2}
                color="oklch(0.45 0.14 145)"
              />
              <StatCard
                label="Cancelled"
                value={stats.cancelled}
                icon={XCircle}
                color="oklch(0.55 0.16 25)"
              />
            </>
          )}
        </motion.div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl border border-border shadow-xs overflow-hidden"
        >
          {/* Filters */}
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-display font-bold text-xl text-foreground">
              All Bookings
            </h2>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            >
              <TabsList className="bg-muted h-9">
                <TabsTrigger value="all" className="text-xs font-ui px-3">
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger
                  value={Status.pending}
                  className="text-xs font-ui px-3"
                >
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger
                  value={Status.confirmed}
                  className="text-xs font-ui px-3"
                >
                  Confirmed ({stats.confirmed})
                </TabsTrigger>
                <TabsTrigger
                  value={Status.cancelled}
                  className="text-xs font-ui px-3"
                >
                  Cancelled ({stats.cancelled})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-ui font-semibold text-foreground whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleSort("customerName")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Customer
                      <SortIcon field="customerName" />
                    </button>
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground whitespace-nowrap hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleSort("partyDate")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Party Date
                      <SortIcon field="partyDate" />
                    </button>
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground whitespace-nowrap hidden lg:table-cell">
                    Package
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground whitespace-nowrap hidden lg:table-cell">
                    Guests
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-ui font-semibold text-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }, (_, i) => `row-sk-${i}`).map(
                    (id) => <TableRowSkeleton key={id} />,
                  )}

                {!isLoading && displayedBookings.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-16 text-muted-foreground font-body"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-3xl">📋</div>
                        No bookings found
                        {activeTab !== "all"
                          ? ` with status "${activeTab}"`
                          : ""}
                        .
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  displayedBookings.map((booking) => {
                    const isUpdating = updatingId === booking.id;
                    const formattedDate = new Date(
                      booking.partyDate,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <TableRow
                        key={booking.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-ui font-semibold text-foreground text-sm whitespace-nowrap">
                              {booking.customerName}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              #{booking.id.slice(0, 8)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm font-body text-muted-foreground">
                            {booking.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm font-body whitespace-nowrap">
                            <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
                            {formattedDate}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm font-body text-foreground">
                            {getPackageName(booking.packageId)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm font-body">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            {Number(booking.numberOfGuests)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : (
                            <StatusBadge status={booking.status} />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to="/confirmation/$bookingId"
                              params={{ bookingId: booking.id }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                aria-label="View booking details"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                  disabled={isUpdating}
                                  aria-label="Booking actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      booking,
                                      Status.confirmed,
                                    )
                                  }
                                  disabled={booking.status === Status.confirmed}
                                  className="font-ui text-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                  Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      booking,
                                      Status.cancelled,
                                    )
                                  }
                                  disabled={booking.status === Status.cancelled}
                                  className="font-ui text-sm text-destructive focus:text-destructive"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {!isLoading && displayedBookings.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground font-body">
                Showing {displayedBookings.length} of {stats.total} booking
                {stats.total !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
