import { cn } from "@/lib/utils";

export interface JustPralaxImgHorizontalSectionContent {
  imageUrl: string;
}

export interface JustPralaxImgHorizontalSectionProps {
  content: JustPralaxImgHorizontalSectionContent;
  className?: string;
}

export function JustPralaxImgHorizontalSection({
  content,
  className,
}: JustPralaxImgHorizontalSectionProps) {
  return (
    <section className={cn("w-full", className)}>
      <div className="page-margin">
        <div
          className="relative mx-auto flex h-[400px] w-full max-w-screen-2xl items-center justify-center overflow-hidden theme-radius-media bg-fixed bg-cover bg-center lg:h-[300px]"
          style={{
            backgroundImage: `url('${content.imageUrl}')`,
          }}
          aria-label="Parallax image"
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(39, 39, 42, 0.5)" }}
          />
        </div>
      </div>
    </section>
  );
}