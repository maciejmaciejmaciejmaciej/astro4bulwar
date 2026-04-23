export function QuoteSection() {
  return (
    <section className="bg-surface-container-high py-40">
      <div className="theme-section-wrapper">
        <div className="mx-auto max-w-4xl text-center">
        <span className="text-8xl font-headline opacity-10 block mb-[-2rem]">“</span>
        <blockquote className="font-headline text-2xl md:text-4xl text-primary italic mb-12">
          Culinary art is the only science that allows us to explore the world without ever leaving our seats. Andé captures this essence perfectly.
        </blockquote>
        <cite className="font-label uppercase text-xs not-italic text-zinc-500">NELSON GRIFFITH</cite>
        </div>
      </div>
    </section>
  );
}