import { cn } from "@/lib/utils";

export interface Promo3ImageContent {
  src: string;
  alt: string;
}

export interface Promo3Content {
  title: string;
  story: string;
  image: Promo3ImageContent;
  buttonLabel?: string;
  buttonHref?: string;
}

export interface Promo3Props {
  content?: Promo3Content;
  className?: string;
}

export const DEFAULT_PROMO3_CONTENT: Promo3Content = {
  title: "Our story",
  story:
    "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect. Our story is built on passion, innovation, and the drive to bring meaningful ideas to life.",
  image: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri4/img10.png",
    alt: "Portrait editorial image",
  },
};

export function Promo3({
  content = DEFAULT_PROMO3_CONTENT,
  className,
}: Promo3Props) {
  const shouldRenderButton =
    typeof content.buttonLabel === "string" &&
    content.buttonLabel.trim().length > 0 &&
    typeof content.buttonHref === "string" &&
    content.buttonHref.trim().length > 0;

  return (
    <section className={cn("page-margin py-32", className)}>
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex justify-center">
            <img
              src={content.image.src}
              alt={content.image.alt}
              className="w-1/2 max-w-[400px] aspect-[1/2] rounded-[4px] object-cover"
            />
          </div>

          <div className="flex flex-col items-start gap-6">
            <h2 className="lead-copy text-on-surface">
              {content.story}
            </h2>

            {shouldRenderButton ? (
              <a
                className="theme-radius-control inline-flex w-fit items-center border border-on-surface px-4 py-2 font-label text-xs uppercase tracking-[0.12em] text-on-surface transition-colors hover:bg-on-surface hover:text-background"
                href={content.buttonHref}
              >
                {content.buttonLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}