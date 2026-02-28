import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Cake,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Package,
  PartyPopper,
  Phone,
  User,
  Users,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateBooking, usePackages } from "../hooks/useQueries";

interface FormData {
  customerName: string;
  email: string;
  phone: string;
  partyDate: string;
  numberOfGuests: string;
  packageId: string;
  specialRequests: string;
}

interface FormErrors {
  customerName?: string;
  email?: string;
  phone?: string;
  partyDate?: string;
  numberOfGuests?: string;
  packageId?: string;
}

function validateForm(data: FormData, maxGuests: number): FormErrors {
  const errors: FormErrors = {};

  if (!data.customerName.trim()) {
    errors.customerName = "Full name is required";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  }
  if (!data.partyDate) {
    errors.partyDate = "Party date is required";
  } else {
    const selected = new Date(data.partyDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.partyDate = "Party date cannot be in the past";
    }
  }
  if (!data.numberOfGuests) {
    errors.numberOfGuests = "Number of guests is required";
  } else {
    const guests = Number.parseInt(data.numberOfGuests);
    if (Number.isNaN(guests) || guests < 1) {
      errors.numberOfGuests = "Please enter a valid number of guests";
    } else if (maxGuests > 0 && guests > maxGuests) {
      errors.numberOfGuests = `This package supports up to ${maxGuests} guests`;
    }
  }
  if (!data.packageId) {
    errors.packageId = "Please select a package";
  }

  return errors;
}

// ── Today as YYYY-MM-DD for min date ─────────────────
function todayString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.0, 0.0, 0.2, 1] },
  },
};

export default function BookingFormPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { package?: string };
  const preSelectedPackageId = (search as { package?: string })?.package ?? "";

  const { data: packages, isLoading: packagesLoading } = usePackages();
  const createBooking = useCreateBooking();

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    email: "",
    phone: "",
    partyDate: "",
    numberOfGuests: "",
    packageId: preSelectedPackageId,
    specialRequests: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Pre-select package from query param
  useEffect(() => {
    if (preSelectedPackageId && packages) {
      const pkg = packages.find((p) => p.id === preSelectedPackageId);
      if (pkg) {
        setFormData((prev) => ({ ...prev, packageId: preSelectedPackageId }));
      }
    }
  }, [preSelectedPackageId, packages]);

  const selectedPackage = packages?.find((p) => p.id === formData.packageId);
  const maxGuests = selectedPackage ? Number(selectedPackage.maxGuests) : 0;

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateForm(
        { ...formData, [field]: value },
        maxGuests,
      );
      setErrors((prev) => ({
        ...prev,
        [field]: newErrors[field as keyof FormErrors],
      }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(formData, maxGuests);
    setErrors((prev) => ({
      ...prev,
      [field]: newErrors[field as keyof FormErrors],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    for (const k of Object.keys(formData)) {
      allTouched[k] = true;
    }
    setTouched(allTouched);

    const newErrors = validateForm(formData, maxGuests);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first error field
      const firstErrorEl = document.querySelector(
        "[data-error='true']",
      ) as HTMLElement;
      firstErrorEl?.focus();
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        customerName: formData.customerName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        partyDate: formData.partyDate,
        numberOfGuests: Number.parseInt(formData.numberOfGuests),
        packageId: formData.packageId,
        specialRequests: formData.specialRequests.trim(),
      });

      toast.success("🎉 Booking created successfully!");
      navigate({
        to: "/confirmation/$bookingId",
        params: { bookingId: booking.id },
      });
    } catch (_err) {
      toast.error("Failed to create booking. Please try again.");
    }
  }

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Header banner */}
      <div className="bg-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-60" />
        <div className="relative z-10 container max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-party-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-party">
              <Cake className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-2">
              Book Your Party
            </h1>
            <p className="text-white/70 font-body text-lg">
              Fill in the details below and we'll take care of the rest
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-card rounded-3xl border border-border shadow-party p-8 sm:p-10 space-y-8"
          >
            {/* Personal Info */}
            <motion.fieldset variants={itemVariants} className="space-y-5">
              <legend className="flex items-center gap-2 font-display font-bold text-lg text-foreground mb-5">
                <div className="w-8 h-8 bg-party-gradient rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                Personal Information
              </legend>

              {/* Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="customerName"
                  className="font-ui font-medium text-foreground"
                >
                  Full Name{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="Sarah Johnson"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleChange("customerName", e.target.value)
                    }
                    onBlur={() => handleBlur("customerName")}
                    aria-required
                    aria-invalid={!!errors.customerName}
                    aria-describedby={
                      errors.customerName ? "customerName-error" : undefined
                    }
                    data-error={!!errors.customerName || undefined}
                    className={`pl-10 h-11 font-body ${errors.customerName ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                    autoComplete="name"
                  />
                </div>
                {errors.customerName && (
                  <p
                    id="customerName-error"
                    role="alert"
                    className="text-sm text-destructive font-body"
                  >
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="font-ui font-medium text-foreground"
                  >
                    Email{" "}
                    <span className="text-destructive" aria-hidden>
                      *
                    </span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      aria-required
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      data-error={!!errors.email || undefined}
                      className={`pl-10 h-11 font-body ${errors.email ? "border-destructive" : ""}`}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="text-sm text-destructive font-body"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="font-ui font-medium text-foreground"
                  >
                    Phone Number{" "}
                    <span className="text-destructive" aria-hidden>
                      *
                    </span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      aria-required
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      data-error={!!errors.phone || undefined}
                      className={`pl-10 h-11 font-body ${errors.phone ? "border-destructive" : ""}`}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && (
                    <p
                      id="phone-error"
                      role="alert"
                      className="text-sm text-destructive font-body"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </motion.fieldset>

            <div className="h-px bg-border" />

            {/* Party Details */}
            <motion.fieldset variants={itemVariants} className="space-y-5">
              <legend className="flex items-center gap-2 font-display font-bold text-lg text-foreground mb-5">
                <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center">
                  <PartyPopper className="w-4 h-4 text-white" />
                </div>
                Party Details
              </legend>

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Party Date */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="partyDate"
                    className="font-ui font-medium text-foreground"
                  >
                    Party Date{" "}
                    <span className="text-destructive" aria-hidden>
                      *
                    </span>
                  </Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="partyDate"
                      type="date"
                      min={todayString()}
                      value={formData.partyDate}
                      onChange={(e) =>
                        handleChange("partyDate", e.target.value)
                      }
                      onBlur={() => handleBlur("partyDate")}
                      aria-required
                      aria-invalid={!!errors.partyDate}
                      aria-describedby={
                        errors.partyDate ? "partyDate-error" : undefined
                      }
                      data-error={!!errors.partyDate || undefined}
                      className={`pl-10 h-11 font-body ${errors.partyDate ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.partyDate && (
                    <p
                      id="partyDate-error"
                      role="alert"
                      className="text-sm text-destructive font-body"
                    >
                      {errors.partyDate}
                    </p>
                  )}
                </div>

                {/* Number of Guests */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="numberOfGuests"
                    className="font-ui font-medium text-foreground"
                  >
                    Number of Guests{" "}
                    <span className="text-destructive" aria-hidden>
                      *
                    </span>
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="numberOfGuests"
                      type="number"
                      min="1"
                      max={maxGuests > 0 ? maxGuests : undefined}
                      placeholder="e.g. 25"
                      value={formData.numberOfGuests}
                      onChange={(e) =>
                        handleChange("numberOfGuests", e.target.value)
                      }
                      onBlur={() => handleBlur("numberOfGuests")}
                      aria-required
                      aria-invalid={!!errors.numberOfGuests}
                      aria-describedby={
                        errors.numberOfGuests ? "guests-error" : undefined
                      }
                      data-error={!!errors.numberOfGuests || undefined}
                      className={`pl-10 h-11 font-body ${errors.numberOfGuests ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.numberOfGuests && (
                    <p
                      id="guests-error"
                      role="alert"
                      className="text-sm text-destructive font-body"
                    >
                      {errors.numberOfGuests}
                    </p>
                  )}
                  {selectedPackage && !errors.numberOfGuests && (
                    <p className="text-xs text-muted-foreground font-body">
                      Max {Number(selectedPackage.maxGuests)} guests for this
                      package
                    </p>
                  )}
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="packageId"
                  className="font-ui font-medium text-foreground"
                >
                  Package{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <div className="relative">
                  <Select
                    value={formData.packageId}
                    onValueChange={(v) => {
                      handleChange("packageId", v);
                      setTouched((prev) => ({ ...prev, packageId: true }));
                    }}
                    disabled={packagesLoading}
                  >
                    <SelectTrigger
                      id="packageId"
                      className={`w-full h-11 font-body ${errors.packageId ? "border-destructive" : ""}`}
                      aria-required
                      aria-invalid={!!errors.packageId}
                    >
                      <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                      <SelectValue
                        placeholder={
                          packagesLoading
                            ? "Loading packages…"
                            : "Select a package"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {packages?.map((pkg) => (
                        <SelectItem
                          key={pkg.id}
                          value={pkg.id}
                          className="font-body"
                        >
                          <span className="font-semibold">{pkg.name}</span>
                          <span className="text-muted-foreground ml-2">
                            ${Number(pkg.price)} · up to {Number(pkg.maxGuests)}{" "}
                            guests
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.packageId && (
                  <p
                    role="alert"
                    className="text-sm text-destructive font-body"
                  >
                    {errors.packageId}
                  </p>
                )}

                {/* Selected package preview */}
                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 bg-secondary/60 rounded-xl border border-border"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-ui font-semibold text-sm text-foreground mb-1">
                          {selectedPackage.name}
                        </div>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          {selectedPackage.description}
                        </p>
                      </div>
                      <Badge className="bg-primary/15 text-primary border-0 shrink-0 font-ui font-bold">
                        ${Number(selectedPackage.price)}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedPackage.features.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-1 text-xs font-body text-muted-foreground"
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          {f}
                        </span>
                      ))}
                      {selectedPackage.features.length > 3 && (
                        <span className="text-xs text-muted-foreground font-body">
                          +{selectedPackage.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="specialRequests"
                  className="font-ui font-medium text-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    Special Requests
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </span>
                </Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Tell us about any special themes, dietary requirements, or specific wishes for the celebration…"
                  value={formData.specialRequests}
                  onChange={(e) =>
                    handleChange("specialRequests", e.target.value)
                  }
                  className="min-h-28 resize-y font-body"
                  autoComplete="off"
                />
              </div>
            </motion.fieldset>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full h-14 bg-party-gradient hover:opacity-90 text-white font-ui font-bold text-base rounded-xl shadow-party transition-opacity"
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating your booking…
                  </>
                ) : (
                  <>
                    <PartyPopper className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3 font-body">
                We'll send a confirmation to your email address
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
