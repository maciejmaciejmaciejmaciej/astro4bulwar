import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Template2CtaProps {
  className?: string;
}

export default function Template2Cta({ className }: Template2CtaProps) {
  return (
    <section className={cn("bg-muted py-8 sm:py-16 lg:py-24", className)}>
      <div className="mx-auto max-w-5xl page-margin">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="relative h-64 overflow-hidden rounded-lg border border-border bg-card sm:h-80 lg:h-auto">
              <img
                src="https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-01.png"
                alt="Workspace with laptop"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="rounded-lg border border-border bg-muted p-5 shadow-sm sm:p-6 lg:p-8">
              <div className="flex h-full flex-col justify-between gap-6">
                <h2 className="text-xl lg:text-2xl">
                  Explore insights, stories, and strategies that help you build better products every day.
                </h2>

                <div>
                  <p className="mb-4 font-body text-base text-muted-foreground">
                    Join 1,000,000+ subscribers receiving expert tips on earning more, investing smarter and living
                    better, all in our free newsletter.
                  </p>

                  <form className="gap-3 py-1 max-sm:space-y-2 sm:flex sm:flex-row">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="h-11 w-full flex-1 rounded-lg border border-input bg-background px-4 font-body text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                    <Button size="lg" className="text-base max-sm:w-full" type="submit">
                      Subscribe
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}