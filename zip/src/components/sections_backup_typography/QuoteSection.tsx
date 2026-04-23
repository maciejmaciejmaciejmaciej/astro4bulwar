export function QuoteSection() {
  return (
    <section className="py-40 bg-surface-container-high page-margin">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-8xl font-headline opacity-10 leading-none block mb-[-2rem]">“</span>
        <blockquote className="font-headline text-2xl md:text-4xl leading-relaxed text-primary italic mb-12">
          Culinary art is the only science that allows us to explore the world without ever leaving our seats. Andé captures this essence perfectly.
        </blockquote>
        <cite className="font-label tracking-[0.2rem] uppercase text-xs not-italic text-zinc-500">NELSON GRIFFITH</cite>
      </div>
    </section>
  );
}