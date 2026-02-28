import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Booking, type Package, Status } from "../backend.d";
import { useActor } from "./useActor";

// ── Re-export Status for convenience ──────────────────
export { Status };

// ── Packages ──────────────────────────────────────────
export function usePackages() {
  const { actor, isFetching } = useActor();
  return useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPackages();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ── All Bookings (admin) ───────────────────────────────
export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Single Booking ────────────────────────────────────
export function useBooking(id: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking | null>({
    queryKey: ["booking", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getBooking(id);
    },
    enabled: !!actor && !isFetching && !!id,
    retry: false,
  });
}

// ── Bookings by Email ─────────────────────────────────
export function useBookingsByEmail(email: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings", "email", email],
    queryFn: async () => {
      if (!actor || !email) return [];
      return actor.getBookingsByEmail(email);
    },
    enabled: !!actor && !isFetching && !!email,
    retry: false,
  });
}

// ── Create Booking Mutation ───────────────────────────
export interface CreateBookingInput {
  customerName: string;
  email: string;
  phone: string;
  partyDate: string;
  numberOfGuests: number;
  packageId: string;
  specialRequests: string;
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CreateBookingInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.createBooking(
        input.customerName,
        input.email,
        input.phone,
        input.partyDate,
        BigInt(input.numberOfGuests),
        input.packageId,
        input.specialRequests,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ── Update Booking Status Mutation ────────────────────
export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, { id: string; status: Status }>({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: (updatedBooking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.setQueryData(["booking", updatedBooking.id], updatedBooking);
    },
  });
}
