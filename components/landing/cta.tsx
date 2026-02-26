"use client";

import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function CTA() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <BlurFade delay={0.1} inView>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get organized?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of people who use TaskFlow to stay productive every
            day.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <ShimmerButton className="h-11 px-8 text-sm font-medium">
                Start for Free
              </ShimmerButton>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
