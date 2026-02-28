import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Cake,
  Camera,
  CheckCircle2,
  ChevronRight,
  Music,
  PartyPopper,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { usePackages } from "../hooks/useQueries";

// ── Floating confetti decorations ─────────────────────
const CONFETTI_COLORS = [
  "oklch(0.70 0.19 35)",
  "oklch(0.80 0.16 75)",
  "oklch(0.72 0.20 145)",
  "oklch(0.60 0.22 270)",
  "oklch(0.72 0.20 310)",
];

function ConfettiDecor() {
  const dots = Array.from({ length: 12 }, (_, i) => `dot-${i}`);
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {dots.map((id, i) => (
        <div
          key={id}
          className="absolute w-2 h-2 rounded-full confetti-dot"
          style={{
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${(i * 8 + 4) % 100}%`,
            top: `${(i * 13 + 5) % 80}%`,
            animationDelay: `${i * 0.4}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ── Package card skeleton ─────────────────────────────
function PackageCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: 4 }, (_, i) => `sk-${i}`).map((id) => (
          <Skeleton key={id} className="h-3.5 w-3/4" />
        ))}
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
}

// ── Stats ─────────────────────────────────────────────
const STATS = [
  { value: "500+", label: "Parties Hosted" },
  { value: "4.9★", label: "Average Rating" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Happy Families" },
];

// ── How It Works ──────────────────────────────────────
const STEPS = [
  {
    icon: Cake,
    step: "01",
    title: "Choose Your Package",
    desc: "Browse our curated party packages designed for every budget and dream.",
  },
  {
    icon: Users,
    step: "02",
    title: "Book Your Date",
    desc: "Fill in your details, pick the perfect date, and confirm your guest count.",
  },
  {
    icon: PartyPopper,
    step: "03",
    title: "Celebrate!",
    desc: "Arrive and enjoy — we handle everything so you can focus on the fun.",
  },
];

// ── Amenities ─────────────────────────────────────────
const AMENITIES = [
  { icon: Music, label: "Live Entertainment" },
  { icon: Camera, label: "Photo Booth" },
  { icon: UtensilsCrossed, label: "Custom Catering" },
  { icon: Sparkles, label: "Themed Décor" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.0, 0.0, 0.2, 1] },
  },
};

export default function LandingPage() {
  const { data: packages, isLoading, isError } = usePackages();

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center">
        {/* Background: hero image + overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-birthday.dim_1400x600.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 hero-mesh opacity-90" />
        </div>

        <ConfettiDecor />

        <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-white/15 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-1.5 font-ui">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Premium Birthday Experiences
            </Badge>
          </motion.div>

          <motion.h1
            className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          >
            Every Birthday
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
              Deserves Magic
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto mb-10 font-body leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Let us craft an unforgettable celebration tailored just for your
            loved one. From intimate gatherings to grand parties — we make every
            moment sparkle.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <Link to="/book">
              <Button
                size="lg"
                className="bg-party-gradient hover:opacity-90 text-white font-ui font-bold text-base shadow-party-lg px-8 h-14 rounded-xl transition-opacity"
              >
                <PartyPopper className="w-5 h-5 mr-2" />
                Start Planning Now
              </Button>
            </Link>
            <a href="#packages">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-ui font-semibold text-base h-14 px-8 rounded-xl bg-white/5 backdrop-blur-sm"
              >
                View Packages
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            role="presentation"
            aria-hidden="true"
          >
            <path
              d="M0 80L1440 80L1440 30C1200 70 960 10 720 40C480 70 240 10 0 30L0 80Z"
              fill="oklch(0.98 0.008 75)"
            />
          </svg>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────── */}
      <section className="py-12 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-6 bg-card rounded-2xl border border-border shadow-xs hover:shadow-warm transition-shadow"
              >
                <div className="font-display font-black text-3xl text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-ui text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-secondary text-secondary-foreground border-0 font-ui">
              Simple Process
            </Badge>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto font-body">
              Three easy steps to your dream birthday celebration
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative bg-card rounded-3xl p-8 border border-border shadow-xs hover:shadow-party transition-shadow group"
              >
                <div className="absolute -top-4 -right-4 font-display font-black text-6xl text-muted/40 leading-none pointer-events-none select-none">
                  {step.step}
                </div>
                <div className="w-14 h-14 bg-party-gradient rounded-2xl flex items-center justify-center mb-5 shadow-party group-hover:scale-105 transition-transform">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Packages ────────────────────────────────── */}
      <section id="packages" className="py-20 bg-secondary/40">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-0 font-ui">
              Choose Your Package
            </Badge>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-foreground mb-4">
              Party Packages
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto font-body">
              Every package is designed to create lasting memories — pick the
              perfect fit.
            </p>
          </motion.div>

          {isLoading && (
            <div className="grid md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }, (_, i) => `pkg-sk-${i}`).map((id) => (
                <PackageCardSkeleton key={id} />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">😕</div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Couldn't load packages
              </h3>
              <p className="text-muted-foreground">
                Please refresh the page to try again.
              </p>
            </div>
          )}

          {!isLoading && !isError && packages && (
            <motion.div
              className="grid md:grid-cols-3 gap-8 items-stretch"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {packages.map((pkg, index) => {
                const isPopular = index === 1;
                return (
                  <motion.div
                    key={pkg.id}
                    variants={itemVariants}
                    className={`package-card relative bg-card rounded-3xl border flex flex-col overflow-hidden ${
                      isPopular
                        ? "border-primary shadow-party-lg ring-2 ring-primary/30"
                        : "border-border shadow-xs"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-party-gradient" />
                    )}
                    {isPopular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-party-gradient text-white border-0 font-ui text-xs font-bold shadow-party">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    {/* Header */}
                    <div className={`p-6 pb-5 ${isPopular ? "pt-7" : ""}`}>
                      <h3 className="font-display font-black text-xl text-foreground mb-1">
                        {pkg.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="font-display font-black text-4xl text-primary">
                          ${Number(pkg.price)}
                        </span>
                        <span className="text-muted-foreground font-ui text-sm">
                          / event
                        </span>
                      </div>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border mx-6" />

                    {/* Features */}
                    <div className="p-6 flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-ui text-muted-foreground mb-1">
                        <Users className="w-4 h-4" />
                        Up to {Number(pkg.maxGuests)} guests
                      </div>
                      {pkg.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm font-body text-foreground leading-tight">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="p-6 pt-0">
                      <Link to="/book" search={{ package: pkg.id }}>
                        <Button
                          className={`w-full h-11 font-ui font-bold rounded-xl ${
                            isPopular
                              ? "bg-party-gradient hover:opacity-90 text-white shadow-party"
                              : "bg-foreground text-background hover:bg-foreground/90"
                          }`}
                        >
                          <PartyPopper className="w-4 h-4 mr-2" />
                          Book This Package
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Amenities ───────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-black text-3xl text-foreground">
              Everything Included
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {AMENITIES.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-warm transition-all group"
              >
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-ui font-semibold text-sm text-foreground text-center">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh" />
        <ConfettiDecor />
        <div className="relative z-10 container max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-6">🎂</div>
            <h2 className="font-display font-black text-4xl sm:text-5xl mb-4">
              Ready to Celebrate?
            </h2>
            <p className="text-white/75 text-lg mb-8 font-body max-w-lg mx-auto">
              Don't let the planning stress you out. Let us handle every detail
              so you can simply enjoy the party.
            </p>
            <Link to="/book">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 font-ui font-bold text-base h-14 px-10 rounded-xl shadow-party-lg transition-all hover:scale-105"
              >
                <Cake className="w-5 h-5 mr-2" />
                Book Your Party Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
