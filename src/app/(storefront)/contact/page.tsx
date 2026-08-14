"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Concierge Message Received", "Our private client team will respond within 2 hours.");
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
            Private Concierge
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground-primary">
            Get in Touch With Our Atelier
          </h1>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            Whether you require bespoke watch engraving, private appointment scheduling, or custom corporate gifting, our concierge team is at your disposal.
          </p>

          <div className="space-y-4 pt-4 text-sm text-foreground-primary font-medium">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-accent" />
              <span>concierge@aura-atelier.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <span>+1 (800) 555-AURA</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent" />
              <span>740 Madison Avenue, New York, NY 10065</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How may our concierge assist you today?"
              className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-accent bg-white"
              required
            />
          </div>
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} shimmer className="w-full">
            Send Message to Concierge
          </Button>
        </form>
      </div>
    </div>
  );
}
