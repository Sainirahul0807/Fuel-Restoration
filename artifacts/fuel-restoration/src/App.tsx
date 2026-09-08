import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  Droplets,
  Factory,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Recycle,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const collectorPhone = '9728517836';
const collectorDisplayPhone = '972 851 7836';

type CollectionForm = {
  name: string;
  identity: string;
  address: string;
  phone: string;
  email: string;
  quantity: string;
  date: string;
  time: string;
  notes: string;
};

const initialForm: CollectionForm = {
  name: '',
  identity: '',
  address: '',
  phone: '',
  email: '',
  quantity: '',
  date: '',
  time: '',
  notes: '',
};

const faqItems = [
  { question: 'What happens to the oil?', answer: 'We filter and consolidate your used cooking oil, then send it to biodiesel makers. It becomes a lower-carbon fuel instead of entering drains and soil.' },
  { question: 'How does pickup work?', answer: 'Register a quantity, address, date and time slot. Rahul confirms the route, then collects your sealed containers from home.' },
  { question: 'Which areas do you cover?', answer: 'Our current route starts in Ward Number 1, Sainipura. Message Rahul on WhatsApp to check the nearest available route for your address.' },
  { question: 'Do I get a certificate?', answer: 'Yes. Every contributor gets a digital certificate of appreciation after pickup confirmation, showing litres contributed and the date.' },
  { question: 'Why is recycling oil better?', answer: 'A small amount of oil can pollute a large volume of water and clog drains. Recovery keeps that waste in circulation and displaces a portion of fossil fuel.' },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-3" data-testid="link-logo">
      <span className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground clip-angle">
        <Droplets size={19} strokeWidth={2.5} />
      </span>
      <span className="font-display text-[15px] font-bold tracking-[-.03em] text-foreground">
        FUEL <span className="text-primary">RESTORATION</span>
      </span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['Why it matters', 'why'],
    ['The route', 'how'],
    ['Register oil', 'register'],
    ['Contact', 'contact'],
  ];
  const handleNav = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container-shell flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => handleNav(id)} className="font-mono text-[10px] uppercase tracking-[.13em] text-muted-foreground hover:text-primary" data-testid={`button-nav-${id}`}>
              {label}
            </button>
          ))}
        </nav>
        <button onClick={() => handleNav('register')} className="hidden h-10 items-center gap-2 bg-primary px-4 font-mono text-[10px] font-medium uppercase tracking-[.12em] text-primary-foreground clip-button hover:-translate-y-0.5 md:flex" data-testid="button-header-register">
          Start a pickup <ArrowUpRight size={14} />
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center border border-border text-foreground md:hidden" aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-border bg-background px-5 py-5 md:hidden">
          <div className="container-shell flex flex-col gap-4">
            {links.map(([label, id]) => (
              <button key={id} onClick={() => handleNav(id)} className="text-left font-mono text-[11px] uppercase tracking-[.13em] text-muted-foreground hover:text-primary" data-testid={`button-mobile-nav-${id}`}>
                {label}
              </button>
            ))}
            <button onClick={() => handleNav('register')} className="mt-2 flex h-11 items-center justify-center gap-2 bg-primary font-mono text-[10px] uppercase tracking-[.12em] text-primary-foreground clip-button" data-testid="button-mobile-register">
              Start a pickup <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-border pt-[72px]">
      <div className="absolute inset-0 opacity-25">
        <img src="/oil-route.jpg" alt="" className="h-full w-full object-cover object-center grayscale" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(156_29%_8%/.98)_0%,hsl(156_29%_8%/.9)_45%,hsl(156_29%_8%/.35)_100%)]" />
      <div className="container-shell relative grid min-h-[700px] items-center gap-12 py-24 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
        <div className="max-w-[700px]">
          <div className="reveal mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="eyebrow">Local climate action / 001</span>
          </div>
          <h1 className="reveal reveal-delay-1 font-display text-[clamp(3.65rem,9vw,8.8rem)] font-bold leading-[.88] tracking-[-.085em] text-foreground">
            Waste oil.<br />
            <span className="text-primary">New energy.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-9 max-w-[500px] text-[17px] leading-8 text-muted-foreground">
            We collect used cooking oil from homes, keep it out of the drain, and route it toward clean biodiesel. One bottle at a time, one neighborhood at a time.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button onClick={() => scrollToId('register')} className="clip-button flex h-14 items-center justify-center gap-3 bg-primary px-6 font-mono text-[11px] font-medium uppercase tracking-[.1em] text-primary-foreground hover:-translate-y-1" data-testid="button-hero-register">
              Get your oil collected <ArrowDownRight size={16} />
            </button>
            <button onClick={() => scrollToId('why')} className="flex h-14 items-center justify-center gap-2 px-2 font-mono text-[11px] uppercase tracking-[.1em] text-foreground hover:text-primary" data-testid="button-hero-learn">
              Why it matters <ArrowDownRight size={15} />
            </button>
          </div>
          <div className="mt-14 flex items-center gap-5 border-l-2 border-primary pl-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.13em] text-muted-foreground">Next route briefing</p>
              <p className="mt-1 font-display text-lg font-semibold">Ward 01 · Sainipura</p>
            </div>
            <span className="h-1.5 w-1.5 bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[.13em] text-primary">Open for bookings</span>
          </div>
        </div>
        <div className="relative hidden min-h-[440px] lg:block">
          <div className="absolute right-0 top-5 h-[390px] w-[min(100%,420px)] overflow-hidden border border-primary/40 clip-angle">
            <img src="/oil-route.jpg" alt="Used cooking oil ready for collection" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.14em] text-primary">Material recovered</p>
                <p className="mt-1 font-display text-xl font-semibold text-foreground">Used cooking oil</p>
              </div>
              <Recycle className="text-primary" size={28} />
            </div>
          </div>
          <div className="drift absolute -bottom-2 left-0 w-52 border border-border bg-card p-4 clip-angle">
            <div className="mb-5 flex items-center justify-between">
              <span className="eyebrow">Route live</span>
              <span className="h-2 w-2 bg-primary" />
            </div>
            <div className="route-line h-px w-full" />
            <div className="mt-4 flex items-end justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">Collected this year</span>
              <span className="font-display text-2xl font-bold text-primary">50K<span className="text-sm">+</span></span>
            </div>
          </div>
        </div>
      </div>
      <div className="container-shell flex items-center justify-between border-t border-border/60 py-5">
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">From the kitchen to the road</span>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="h-px w-10 bg-border" />
          <span className="font-mono text-[10px] text-primary">Scroll to explore</span>
          <ArrowDownRight size={14} className="text-primary" />
        </div>
      </div>
    </section>
  );
}

function WhyItMatters() {
  return (
    <section id="why" className="container-shell scroll-mt-24 py-28 lg:py-36">
      <div className="grid gap-16 lg:grid-cols-[.78fr_1.22fr] lg:gap-28">
        <div>
          <span className="eyebrow">01 / Why it matters</span>
          <h2 className="mt-7 max-w-[430px] font-display text-5xl font-semibold leading-[.96] tracking-[-.06em] sm:text-6xl">
            The drain is not the end of the story.
          </h2>
          <p className="mt-7 max-w-[390px] text-[15px] leading-7 text-muted-foreground">
            That last pan of oil has somewhere better to go. When it enters a sink, it hardens in pipes and moves through waterways. When it enters our route, it becomes feedstock for a cleaner fuel system.
          </p>
          <button onClick={() => scrollToId('register')} className="mt-9 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.13em] text-primary hover:gap-5" data-testid="button-why-register">
            Put a bottle on the route <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="group relative min-h-[310px] overflow-hidden border border-border sm:row-span-2">
            <img src="/neighborhood-grid.jpg" alt="A green neighborhood seen at dawn" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <div className="mb-4 grid h-9 w-9 place-items-center bg-primary text-primary-foreground"><Navigation size={17} /></div>
              <h3 className="font-display text-2xl font-semibold">Local routes, real accountability.</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">A home-to-home model makes every litre traceable from your kitchen to its next use.</p>
            </div>
          </div>
          <div className="border border-border bg-card p-6 clip-angle">
            <div className="flex items-center justify-between">
              <Droplets className="text-primary" size={23} />
              <span className="font-mono text-[10px] text-muted-foreground">01 / water</span>
            </div>
            <h3 className="mt-12 font-display text-xl font-semibold">Keep drains moving.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Used oil solidifies in pipes and puts extra load on treatment systems. Recovery starts at home.</p>
          </div>
          <div className="border border-border bg-card p-6 clip-angle">
            <div className="flex items-center justify-between">
              <Factory className="text-primary" size={23} />
              <span className="font-mono text-[10px] text-muted-foreground">02 / energy</span>
            </div>
            <h3 className="mt-12 font-display text-xl font-semibold">Make the next litre count.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Collected oil is a useful raw material for biodiesel — a second life with a practical destination.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactStats() {
  const stats = [
    ['01+', 'Year of operation', 'A route built through consistency.'],
    ['50,000+', 'Litres recovered', 'Kept out of drains and in motion.'],
    ['HOME → HOME', 'Collection model', 'Simple enough for every kitchen.'],
  ];
  return (
    <section id="impact" className="border-y border-border bg-card/50">
      <div className="container-shell grid md:grid-cols-3">
        {stats.map(([value, label, caption], index) => (
          <div key={label} className={`relative py-12 md:px-8 md:py-16 ${index !== 0 ? 'border-t border-border md:border-l md:border-t-0' : ''}`}>
            <span className="eyebrow">0{index + 1} / impact</span>
            <p className="mt-7 font-display text-[clamp(2.7rem,5vw,4.8rem)] font-semibold leading-none tracking-[-.07em] text-primary">{value}</p>
            <p className="mt-5 font-display text-lg font-semibold">{label}</p>
            <p className="mt-2 max-w-[220px] text-sm leading-6 text-muted-foreground">{caption}</p>
            <ArrowUpRight size={18} className="absolute right-5 top-14 text-border md:right-8" />
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Register your oil', body: 'Tell us what you have, where you are, and when a pickup works.', icon: ClipboardIcon },
    { number: '02', title: 'We plan the route', body: 'Our local collector confirms a practical time around the neighborhood route.', icon: CalendarDays },
    { number: '03', title: 'We collect it', body: 'Keep it sealed in a clean container. We handle the handoff from your doorstep.', icon: Recycle },
    { number: '04', title: 'You see the impact', body: 'After pickup, receive a digital certificate for the litres you helped recover.', icon: BadgeCheck },
  ];
  return (
    <section id="how" className="container-shell scroll-mt-24 py-28 lg:py-36">
      <div className="flex flex-col justify-between gap-7 border-b border-border pb-10 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">02 / The route</span>
          <h2 className="mt-6 font-display text-5xl font-semibold tracking-[-.06em] sm:text-6xl">Four moves.<br /><span className="text-primary">One better loop.</span></h2>
        </div>
        <p className="max-w-[290px] text-sm leading-6 text-muted-foreground">No complicated sorting, no drop-off mission. Just save the oil, then let us do the moving.</p>
      </div>
      <div className="grid pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ number, title, body, icon: Icon }, index) => (
          <div key={number} className={`group relative min-h-[280px] border-border py-5 pr-7 ${index < 3 ? 'lg:border-r lg:pr-8' : ''} ${index > 0 ? 'border-t pt-8 lg:border-t-0 lg:pl-8' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-primary">{number}</span>
              <Icon size={21} className="text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <h3 className="mt-16 font-display text-2xl font-semibold leading-tight">{title}</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{body}</p>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-2/3" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ClipboardIcon({ size, className }: { size?: number; className?: string }) {
  return <div className={className} style={{ fontSize: size }}>FORM</div>;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">{label}{required && <b className="text-primary">*</b>}</span>
      {children}
      {error && <span className="mt-2 block font-mono text-[10px] text-destructive" data-testid={`error-${label.toLowerCase().replaceAll(' ', '-')}`}>{error}</span>}
    </label>
  );
}

function RegistrationForm() {
  const [form, setForm] = useState<CollectionForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CollectionForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState<CollectionForm[]>([]);
  const update = (key: keyof CollectionForm, value: string) => {
    setSubmitted(false);
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const validate = () => {
    const next: Partial<Record<keyof CollectionForm, string>> = {};
    if (!form.name.trim()) next.name = 'Please enter your full name.';
    if (!form.address.trim()) next.address = 'Please enter the collection address.';
    if (!/^[0-9+\s()-]{8,}$/.test(form.phone.trim())) next.phone = 'Enter a valid contact number.';
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = 'Enter a quantity above 0 litres.';
    if (!form.date) next.date = 'Choose a pickup date.';
    if (!form.time) next.time = 'Choose a time slot.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmissions((current) => [...current, form]);
    setSubmitted(true);
    setForm(initialForm);
    window.setTimeout(() => document.getElementById('registration-success')?.focus(), 50);
  };
  const inputClass = (key: keyof CollectionForm) => `h-12 w-full border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary ${errors[key] ? 'border-destructive' : 'border-border'}`;
  return (
    <section id="register" className="scroll-mt-24 border-t border-border bg-card/40 py-28 lg:py-36">
      <div className="container-shell grid gap-16 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow">03 / Register a pickup</span>
          <h2 className="mt-6 font-display text-5xl font-semibold leading-[.94] tracking-[-.07em] sm:text-6xl">Put your oil<br /><span className="text-primary">on the route.</span></h2>
          <p className="mt-7 max-w-[350px] text-sm leading-7 text-muted-foreground">Save your used oil in a sealed container once it cools. Share the details below and our collector will confirm the handoff.</p>
          <div className="mt-12 border-l-2 border-primary pl-5">
            <p className="font-mono text-[10px] uppercase tracking-[.14em] text-primary">What to have ready</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Name, address, a reachable phone number, and an honest estimate of litres.</p>
          </div>
          <div className="mt-12 flex items-center gap-3 text-muted-foreground">
            <ShieldCheck size={20} className="text-primary" />
            <span className="text-xs leading-5">Your details stay local while we confirm this pickup.</span>
          </div>
        </div>
        <div>
          {submitted && (
            <div id="registration-success" tabIndex={-1} className="mb-6 flex items-start gap-4 border border-primary bg-primary/10 p-5 text-foreground clip-angle" data-testid="status-registration-success">
              <span className="grid h-8 w-8 shrink-0 place-items-center bg-primary text-primary-foreground"><Check size={17} /></span>
              <div>
                <p className="font-display font-semibold">Your data has been received. Thank you for helping us reduce oil waste!</p>
                <p className="mt-1 text-sm text-muted-foreground">We will review the route details and get in touch to confirm.</p>
              </div>
            </div>
          )}
          <form onSubmit={submit} className="border border-border bg-background p-5 sm:p-8 clip-angle" noValidate>
            <div className="mb-8 flex items-center justify-between border-b border-border pb-5">
              <span className="font-display text-xl font-semibold">Collection details</span>
              <span className="font-mono text-[10px] text-muted-foreground"><b className="text-primary">*</b> required</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required error={errors.name}><input value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass('name')} placeholder="Your name" data-testid="input-name" /></Field>
              <Field label="Identity / ID number"><input value={form.identity} onChange={(e) => update('identity', e.target.value)} className={inputClass('identity')} placeholder="Optional" data-testid="input-identity" /></Field>
              <Field label="Contact number" required error={errors.phone}><input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass('phone')} placeholder="10 digit mobile number" data-testid="input-phone" /></Field>
              <Field label="Email address"><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass('email')} placeholder="Optional" data-testid="input-email" /></Field>
              <div className="sm:col-span-2"><Field label="Location / full address" required error={errors.address}><textarea value={form.address} onChange={(e) => update('address', e.target.value)} className={`min-h-[95px] w-full resize-y border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary ${errors.address ? 'border-destructive' : 'border-border'}`} placeholder="House number, street, area" data-testid="input-address" /></Field></div>
              <Field label="Quantity of oil (litres)" required error={errors.quantity}><input type="number" min="0.1" step="0.1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} className={inputClass('quantity')} placeholder="e.g. 3.5" data-testid="input-quantity" /></Field>
              <Field label="Preferred pickup date" required error={errors.date}><input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className={inputClass('date')} data-testid="input-date" /></Field>
              <Field label="Preferred pickup time slot" required error={errors.time}>
                <select value={form.time} onChange={(e) => update('time', e.target.value)} className={`${inputClass('time')} appearance-none`} data-testid="select-time">
                  <option value="">Select a slot</option><option value="08:00 – 10:00">08:00 – 10:00</option><option value="10:00 – 13:00">10:00 – 13:00</option><option value="16:00 – 19:00">16:00 – 19:00</option>
                </select>
              </Field>
              <div className="sm:col-span-2"><Field label="Additional notes / instructions"><textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className="min-h-[82px] w-full resize-y border border-border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary" placeholder="Gate code, landmark, container notes..." data-testid="input-notes" /></Field></div>
            </div>
            <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-border pt-6 sm:flex-row sm:items-center">
              <p className="max-w-[250px] text-xs leading-5 text-muted-foreground">We will use these details only to coordinate your collection.</p>
              <button type="submit" className="clip-button flex h-13 items-center gap-3 bg-primary px-6 font-mono text-[10px] uppercase tracking-[.12em] text-primary-foreground hover:-translate-y-0.5" data-testid="button-submit-registration">Request a pickup <Send size={14} /></button>
            </div>
          </form>
          <p className="mt-4 text-right font-mono text-[10px] text-muted-foreground" data-testid="text-submission-count">{submissions.length ? `${submissions.length} pickup request${submissions.length > 1 ? 's' : ''} saved locally` : 'No requests saved yet'}</p>
        </div>
      </div>
    </section>
  );
}

function Rewards() {
  return (
    <section id="rewards" className="container-shell scroll-mt-24 py-28 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:gap-24">
        <div>
          <span className="eyebrow">04 / Proof of contribution</span>
          <h2 className="mt-6 font-display text-5xl font-semibold leading-[.95] tracking-[-.07em] sm:text-6xl">A small receipt<br />for a <span className="text-primary">big loop.</span></h2>
          <p className="mt-7 max-w-[390px] text-sm leading-7 text-muted-foreground">Every contributor receives a digital certificate of appreciation after pickup confirmation. It records the litres you moved into a better system.</p>
          <div className="mt-9 flex items-center gap-3"><BadgeCheck className="text-primary" size={20} /><span className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">Generated after pickup confirmation</span></div>
        </div>
        <div className="relative border border-primary/60 bg-[#e8dfc5] p-3 text-[#16251d] shadow-[12px_12px_0_hsl(var(--primary)/.28)] sm:p-5 clip-angle">
          <div className="border border-[#16251d]/30 p-6 sm:p-9">
            <div className="flex items-start justify-between">
              <div><p className="font-mono text-[9px] uppercase tracking-[.2em]">Fuel Restoration</p><p className="mt-2 font-display text-3xl font-bold tracking-[-.05em]">Certificate<span className="text-[#ad721b]">/01</span></p></div>
              <BadgeCheck size={35} className="text-[#ad721b]" />
            </div>
            <div className="my-10 h-px bg-[#16251d]/25" />
            <p className="font-mono text-[9px] uppercase tracking-[.17em] text-[#16251d]/60">This certifies that</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-.04em]">Your Name</p>
            <p className="mt-3 max-w-[310px] text-sm leading-6 text-[#16251d]/70">helped keep used cooking oil in circulation and out of local drains.</p>
            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-[#16251d]/25 pt-5">
              <div><p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#16251d]/60">Contribution</p><p className="mt-2 font-display text-xl font-bold">06.5 litres</p></div>
              <div><p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#16251d]/60">Issued</p><p className="mt-2 font-display text-xl font-bold">Route day</p></div>
            </div>
            <div className="mt-8 flex items-end justify-between"><span className="font-mono text-[9px] uppercase tracking-[.13em] text-[#16251d]/60">A cleaner fuel future, locally routed.</span><span className="h-7 w-7 border-2 border-[#ad721b]" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 border-y border-border bg-[#1a3429] py-20">
      <div className="container-shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div><span className="eyebrow">05 / Your local collector</span><h2 className="mt-5 font-display text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Questions on the route?<br /><span className="text-primary">Talk to Rahul.</span></h2></div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div><p className="font-display text-xl font-semibold">Rahul Saini</p><p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} className="text-primary" /> Ward Number 1, Sainipura</p><p className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground"><Phone size={13} className="text-primary" /> {collectorDisplayPhone}</p></div>
          <div className="flex gap-3"><a href={`tel:${collectorPhone}`} className="clip-button flex h-12 items-center gap-2 bg-primary px-4 font-mono text-[10px] uppercase tracking-[.11em] text-primary-foreground hover:-translate-y-0.5" data-testid="link-call-rahul"><Phone size={14} /> Call now</a><a href={`https://wa.me/91${collectorPhone}`} target="_blank" rel="noreferrer" className="flex h-12 items-center gap-2 border border-primary px-4 font-mono text-[10px] uppercase tracking-[.11em] text-primary hover:bg-primary hover:text-primary-foreground" data-testid="link-whatsapp-rahul"><MessageCircle size={14} /> WhatsApp</a></div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="container-shell scroll-mt-24 py-28 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:gap-28">
        <div><span className="eyebrow">06 / Field notes</span><h2 className="mt-6 font-display text-5xl font-semibold leading-[.95] tracking-[-.07em] sm:text-6xl">Good questions<br /><span className="text-primary">move things.</span></h2><p className="mt-7 max-w-[330px] text-sm leading-7 text-muted-foreground">A few direct answers before your first collection. Still need to know something? The route team is one message away.</p></div>
        <div className="border-t border-border">
          {faqItems.map((item, index) => (
            <div key={item.question} className="border-b border-border">
              <button onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left hover:text-primary" aria-expanded={open === index} data-testid={`button-faq-${index}`}>
                <span className="font-display text-lg font-semibold">{item.question}</span><ChevronDown size={18} className={`shrink-0 transition-transform ${open === index ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
              </button>
              {open === index && <p className="max-w-[650px] pb-6 pr-10 text-sm leading-7 text-muted-foreground" data-testid={`text-faq-answer-${index}`}>{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Hi. I can help with pickups, recycling, covered areas, certificates, and environmental benefits.' },
  ]);
  const panelRef = useRef<HTMLDivElement>(null);
  const reply = (question: string) => {
    const normalized = question.toLowerCase();
    if (normalized.includes('area') || normalized.includes('where')) return faqItems[2].answer;
    if (normalized.includes('certificate') || normalized.includes('reward')) return faqItems[3].answer;
    if (normalized.includes('pickup') || normalized.includes('collect')) return faqItems[1].answer;
    if (normalized.includes('benefit') || normalized.includes('environment') || normalized.includes('drain')) return faqItems[4].answer;
    if (normalized.includes('recycl') || normalized.includes('oil')) return faqItems[0].answer;
    return 'I can help with recycling, pickup, covered areas, certificates, or environmental benefits. Try asking about one of those.';
  };
  const send = (value = input) => {
    if (!value.trim()) return;
    setMessages((current) => [...current, { from: 'user', text: value.trim() }, { from: 'bot', text: reply(value) }]);
    setInput('');
  };
  useEffect(() => {
    if (open && panelRef.current) panelRef.current.scrollTop = panelRef.current.scrollHeight;
  }, [messages, open]);
  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {open && <div className="mb-3 w-[min(360px,calc(100vw-40px))] overflow-hidden border border-primary/60 bg-card shadow-[0_16px_50px_rgba(0,0,0,.35)] clip-angle" data-testid="panel-chatbot">
        <div className="flex items-center justify-between border-b border-border bg-[#1a3429] px-4 py-4"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center bg-primary text-primary-foreground"><Bot size={16} /></span><div><p className="font-display text-sm font-semibold">Route assistant</p><p className="font-mono text-[9px] uppercase tracking-[.12em] text-primary">Online / local answers</p></div></div><button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary" aria-label="Close chat" data-testid="button-close-chat"><X size={17} /></button></div>
        <div ref={panelRef} className="max-h-[290px] space-y-3 overflow-y-auto p-4" data-testid="chat-messages">
          {messages.map((message, index) => <div key={`${message.from}-${index}`} className={`max-w-[88%] border px-3 py-2 text-xs leading-5 ${message.from === 'user' ? 'ml-auto border-primary/50 bg-primary/10 text-foreground' : 'border-border bg-background text-muted-foreground'}`} data-testid={`chat-message-${index}`}>{message.text}</div>)}
        </div>
        <div className="border-t border-border p-3"><div className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') send(); }} className="h-10 min-w-0 flex-1 border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary" placeholder="Ask about pickup..." aria-label="Chat message" data-testid="input-chat" /><button onClick={() => send()} className="grid h-10 w-10 shrink-0 place-items-center bg-primary text-primary-foreground hover:bg-primary/90" aria-label="Send chat message" data-testid="button-send-chat"><Send size={15} /></button></div></div>
      </div>}
      <button onClick={() => setOpen(!open)} className="ml-auto flex h-14 items-center gap-3 bg-primary px-4 text-primary-foreground shadow-[0_8px_30px_rgba(0,0,0,.3)] clip-button hover:-translate-y-1" aria-label={open ? 'Close route assistant' : 'Open route assistant'} data-testid="button-open-chat"><span className="grid h-7 w-7 place-items-center border border-primary-foreground/40"><MessageCircle size={16} /></span><span className="hidden font-mono text-[10px] uppercase tracking-[.12em] sm:inline">{open ? 'Close' : 'Ask the route'}</span></button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr]">
        <div><Logo /><p className="mt-6 max-w-[300px] text-sm leading-6 text-muted-foreground">Turning yesterday's kitchen waste into tomorrow's cleaner miles.</p><div className="mt-7 flex items-center gap-2"><span className="h-px w-10 bg-primary" /><span className="font-mono text-[10px] uppercase tracking-[.15em] text-primary">Keep it in circulation</span></div></div>
        <div><p className="eyebrow">Explore</p><div className="mt-5 flex flex-col items-start gap-3">{[['Why it matters', 'why'], ['The route', 'how'], ['Register oil', 'register'], ['Questions', 'faq']].map(([label, id]) => <button key={id} onClick={() => scrollToId(id)} className="text-sm text-muted-foreground hover:text-primary" data-testid={`button-footer-${id}`}>{label}</button>)}</div></div>
        <div><p className="eyebrow">Collector desk</p><p className="mt-5 font-display font-semibold">Rahul Saini</p><p className="mt-1 text-sm text-muted-foreground">Ward Number 1, Sainipura</p><a href={`tel:${collectorPhone}`} className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-foreground" data-testid="link-footer-phone"><Phone size={13} /> {collectorDisplayPhone}</a></div>
      </div>
      <div className="container-shell flex flex-col justify-between gap-3 border-t border-border py-5 sm:flex-row"><p className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">© 2025 Fuel Restoration</p><p className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">Waste is a design problem. Route it better.</p></div>
    </footer>
  );
}

function Home() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return (
    <div className="noise min-h-[100dvh] overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <WhyItMatters />
        <ImpactStats />
        <HowItWorks />
        <RegistrationForm />
        <Rewards />
        <ContactSection />
        <FAQ />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;