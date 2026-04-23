import { Button } from "@/components/ui/button";

export function SpecialOfferSection() {
  return (
    <section className="py-32 bg-primary text-on-primary page-margin">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="font-headline text-4xl tracking-[0.4rem] uppercase">SPECIAL OFFER</h2>
        <p className="font-body text-secondary-fixed-dim text-lg leading-relaxed max-w-2xl mx-auto">
          Join us for our monthly "Chef's Table" experience. An eight-course journey curated for the most discerning palates. Limited availability.
        </p>
        <div className="pt-4">
          <Button className="bg-surface text-primary px-8 py-4 font-label tracking-[0.1em] uppercase text-[11px] hover:bg-surface-container-high transition-colors rounded-[4px]">
            DISCOVER
          </Button>
        </div>
      </div>
    </section>
  );
}