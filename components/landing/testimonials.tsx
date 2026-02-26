"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "TaskFlow replaced three different apps for me. It's simple, fast, and just works.",
    name: "Sarah Chen",
    role: "Product Designer",
  },
  {
    quote:
      "The confetti when you complete a task is such a nice touch. Makes productivity fun!",
    name: "Marcus Rodriguez",
    role: "Software Engineer",
  },
  {
    quote:
      "I love that I can access my tasks from my phone and laptop seamlessly.",
    name: "Emily Park",
    role: "Marketing Lead",
  },
  {
    quote:
      "Clean, minimal, no bloat. This is exactly what a to-do app should be.",
    name: "James Wilson",
    role: "Freelance Writer",
  },
  {
    quote:
      "The progress tracking keeps me motivated throughout the day. Highly recommend.",
    name: "Aisha Patel",
    role: "Project Manager",
  },
  {
    quote:
      "Signed up in seconds and had all my tasks organized within minutes. Great UX.",
    name: "David Kim",
    role: "Startup Founder",
  },
];

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <Card className="w-72 shrink-0 border-border/50">
      <CardContent className="pt-0">
        <p className="mb-4 text-sm text-muted-foreground">&ldquo;{quote}&rdquo;</p>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const firstRow = testimonials.slice(0, 3);
const secondRow = testimonials.slice(3);

export function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <BlurFade delay={0.1} inView>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by productive people
            </h2>
            <p className="mt-3 text-muted-foreground">
              See what our users have to say about TaskFlow.
            </p>
          </div>
        </BlurFade>

        <div className="relative">
          <Marquee pauseOnHover className="[--duration:30s]">
            {firstRow.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="mt-4 [--duration:30s]">
            {secondRow.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
