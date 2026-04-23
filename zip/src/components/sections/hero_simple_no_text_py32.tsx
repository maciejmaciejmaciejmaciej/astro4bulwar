export interface HeroSimpleNoTextPy32Content {
  imageSrc: string;
  alt: string;
}

export const DEFAULT_HERO_SIMPLE_NO_TEXT_PY32_CONTENT: HeroSimpleNoTextPy32Content = {
  imageSrc: "/react/images/home_hero.jpg",
  alt: "Hero preview py32",
};

interface HeroSimpleNoTextPy32Props {
  content?: HeroSimpleNoTextPy32Content;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

export function HeroSimpleNoTextPy32({
  content,
  imageSrc,
  alt,
  className,
}: HeroSimpleNoTextPy32Props) {
  const resolvedContent = content ?? {
    imageSrc: imageSrc ?? DEFAULT_HERO_SIMPLE_NO_TEXT_PY32_CONTENT.imageSrc,
    alt: alt ?? DEFAULT_HERO_SIMPLE_NO_TEXT_PY32_CONTENT.alt,
  };

  return (
    <section className={className ? `relative bg-white page-margin pb-12 ${className}` : "relative bg-white page-margin pb-12"}>
      <div className="mx-auto max-w-screen-2xl">
        <div className="relative w-full overflow-hidden theme-radius-media aspect-[4/3] md:aspect-[21/9] md:max-h-[650px]">
          <img
            src={resolvedContent.imageSrc}
            alt={resolvedContent.alt}
            className="h-full w-full object-cover theme-radius-media"
          />
        </div>
        <div className="mx-auto mt-12 h-[1px] w-20 bg-black" />
      </div>
    </section>
  );
}

export { HeroSimpleNoTextPy32 as hero_simple_no_text_py32 };