import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: string;
    customerName: string;
    status: Status;
    specialRequests: string;
    createdAt: bigint;
    email: string;
    partyDate: string;
    phone: string;
    numberOfGuests: bigint;
    packageId: string;
}
export interface Package {
    id: string;
    features: Array<string>;
    name: string;
    description: string;
    price: bigint;
    maxGuests: bigint;
}
export enum Status {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export interface backendInterface {
    createBooking(customerName: string, email: string, phone: string, partyDate: string, numberOfGuests: bigint, packageId: string, specialRequests: string): Promise<Booking>;
    getAllBookings(): Promise<Array<Booking>>;
    getBooking(id: string): Promise<Booking>;
    getBookingsByEmail(email: string): Promise<Array<Booking>>;
    getPackages(): Promise<Array<Package>>;
    init(): Promise<void>;
    updateBookingStatus(id: string, status: Status): Promise<Booking>;
}
