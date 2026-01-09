import { useMemo, useState } from "react";

const FORM_ENDPOINT = "https://formspree.io/f/mvzgenjl";

export default function Contact() {
  const contact = useMemo(
    () => ({
      email: "melchorespinosa37@gmail.com",
      phone: "+63 926 079 4654",
      location: "Philippines",
      linkedin: "https://www.linkedin.com/in/melchor-espinosa-1399b0359",
      github: "https://github.com/", // change this to your GitHub
    }),
    []
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "", // honeypot (spam bots fill this)
  });

  const [status, setStatus] = useState({
    state: "idle", // idle | sending | success | error
    message: "",
  });

  const [copied, setCopied] = useState({ email: false, phone: false });

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied((s) => ({ ...s, [key]: true }));
      setTimeout(() => setCopied((s) => ({ ...s, [key]: false })), 1200);
    } catch {
      // ignore
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // honeypot
    if (form.company) return;

    setStatus({ state: "sending", message: "" });

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          _subject: `Portfolio Message from ${form.name || "Someone"}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.errors?.[0]?.message ||
          "Message could not be sent. Please try again later.";
        throw new Error(msg);
      }

      setStatus({ state: "success", message: "Message sent successfully! ✅" });
      setForm({ name: "", email: "", phone: "", message: "", company: "" });
    } catch (err) {
      setStatus({
        state: "error",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="mt-2 text-neutral-300">
          Let’s connect — send a message and I’ll get back to you.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {/* soft background glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative grid md:grid-cols-[0.95fr_1.35fr]">
          {/* LEFT PANEL */}
          <div className="p-6 md:p-8">
            <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/25 via-fuchsia-500/10 to-cyan-500/10 p-6">
              <h3 className="text-xl font-semibold text-white">Let’s Connect</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-200/90">
                Open to opportunities and collaborations. If you’re looking for a
                dedicated developer or want to discuss a project, feel free to message me.
              </p>

              <div className="mt-6 space-y-3">
                <InfoRow
                  icon={<MailIcon />}
                  label="Email"
                  value={contact.email}
                  actionLabel={copied.email ? "Copied!" : "Copy"}
                  onAction={() => copy("email", contact.email)}
                />
                <InfoRow
                  icon={<PhoneIcon />}
                  label="Phone"
                  value={contact.phone}
                  actionLabel={copied.phone ? "Copied!" : "Copy"}
                  onAction={() => copy("phone", contact.phone)}
                />
                <InfoRow icon={<PinIcon />} label="Location" value={contact.location} />
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-200/80">
                  Connect with me
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SocialButton href={contact.linkedin} label="LinkedIn" icon={<LinkedInIcon />} />
                  <SocialButton href={contact.github} label="GitHub" icon={<GitHubIcon />} />
                  <SocialButton href={`mailto:${contact.email}`} label="Email" icon={<MailIcon />} />
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                <p className="text-sm font-semibold text-white">Form Status</p>
                <p className="mt-1 text-sm text-neutral-200/80">
                  {status.state === "idle" && "Use the form to send a message."}
                  {status.state === "sending" && "Sending your message…"}
                  {status.state === "success" && status.message}
                  {status.state === "error" && status.message}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 md:p-8">
            <div className="rounded-3xl border border-white/10 bg-neutral-950/40 p-6 md:p-7">
              <h3 className="text-xl font-semibold text-white">Send me a message</h3>
              <p className="mt-2 text-sm text-neutral-300">
                Fill out the form below and I’ll get back to you shortly.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                {/* Honeypot (hidden) */}
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(v) => setForm((s) => ({ ...s, name: v }))}
                    required
                  />
                  <Field
                    label="Email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                    type="email"
                    required
                  />
                </div>

                <Field
                  label="Phone (optional)"
                  placeholder="+63 9xx xxx xxxx"
                  value={form.phone}
                  onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                />

                <TextArea
                  label="Message"
                  placeholder="Tell me about your project…"
                  value={form.message}
                  onChange={(v) => setForm((s) => ({ ...s, message: v }))}
                  required
                />

                <button
                  type="submit"
                  disabled={status.state === "sending"}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                >
                  {status.state === "sending" ? "Sending..." : "Send Message"}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>

                {status.state === "success" && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                    {status.message}
                  </div>
                )}

                {status.state === "error" && (
                  <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">
                    {status.message}
                  </div>
                )}

                <p className="text-xs text-neutral-500">
                  Powered by Formspree.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Helpers ---------------- */

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
        {label}
      </span>
      <textarea
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
    </label>
  );
}

function InfoRow({ icon, label, value, onAction, actionLabel }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-sm text-neutral-200/80">{value}</p>
        </div>
      </div>

      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
        >
          {actionLabel || "Copy"}
        </button>
      ) : null}
    </div>
  );
}

function SocialButton({ href, label, icon }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

/* ---------------- Icons ---------------- */

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h3l2 5-2 1c1 3 4 6 7 7l1-2 5 2v3c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      <path d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 9.5V18M6.5 6.2v.1M10 10.5V18m0-4c0-2.2 1.2-3.6 3.3-3.6 2 0 2.7 1.4 2.7 3.6V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M4 4h16v16H4V4Z" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 19c-4 1.5-4-2-5-2m10 4v-3.2c0-.9.3-1.5.8-2-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0C19.2 1 20.2 1.3 20.2 1.3c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .5.4.9 1.2.9 2.4V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
