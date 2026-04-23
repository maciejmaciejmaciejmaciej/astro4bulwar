export interface HeroSimpleNoTextNormalWideContent {
  imageSrc: string;
  alt: string;
}

export const DEFAULT_HERO_SIMPLE_NO_TEXT_NORMAL_WIDE_CONTENT: HeroSimpleNoTextNormalWideContent = {
  imageSrc: "/react/images/home_hero.jpg",
  alt: "Hero preview wide",
};

interface HeroSimpleNoTextNormalWideProps {
  content?: HeroSimpleNoTextNormalWideContent;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

export function HeroSimpleNoTextNormalWide({
  content,
  imageSrc,
  alt,
  className,
}: HeroSimpleNoTextNormalWideProps) {
  const resolvedContent = content ?? {
    imageSrc: imageSrc ?? DEFAULT_HERO_SIMPLE_NO_TEXT_NORMAL_WIDE_CONTENT.imageSrc,
    alt: alt ?? DEFAULT_HERO_SIMPLE_NO_TEXT_NORMAL_WIDE_CONTENT.alt,
  };

  return (
    <section className={className ? `relative bg-white page-margin pb-12 ${className}` : "relative bg-white page-margin pb-12"}>
      <div className="relative w-full overflow-hidden theme-radius-media aspect-[4/3] md:aspect-[21/9]">
        <img
          src={resolvedContent.imageSrc}
          alt={resolvedContent.alt}
          className="h-full w-full object-cover theme-radius-media"
        />
      </div>
      <div className="mx-auto mt-12 h-[1px] w-20 bg-black" />
    </section>
  );
}

export { HeroSimpleNoTextNormalWide as hero_simple_no_text_normal_wide };