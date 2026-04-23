import { cn } from "@/lib/utils";
import type { MenuColumn } from "@/src/blocks/registry/common";

import {
  PageBuilderMenuSection,
  type PageBuilderMenuSectionVariant,
} from "./PageBuilderMenuSection";

export interface MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSectionContent {
  heroTitle: string;
  backgroundImage: {
    src: string;
    alt: string;
  };
  overlayOpacity?: number;
  layout?: {
    heroHeight?: string;
  };
  menuColumns: MenuColumn[];
  emptyStateText: string;
}

export interface MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSectionProps {
  content: MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSectionContent;
  variant?: PageBuilderMenuSectionVariant | null;
  className?: string;
}

export function MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection({
  content,
  className,
}: MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSectionProps) {
  const overlayOpacity = 0.5;

  return (
    <section className={cn("w-full", className)}>
      <div className="page-margin">
        <div
          className="theme-radius-media relative mx-auto flex h-[400px] w-full max-w-screen-2xl items-center justify-center overflow-hidden rounded-b-none bg-fixed bg-cover bg-center lg:h-[300px]"
          style={{
            backgroundImage: `url('${content.backgroundImage.src}')`,
          }}
          aria-label={content.backgroundImage.alt}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(39, 39, 42, ${overlayOpacity})` }}
          />
          <h2 className="relative z-10 px-4 text-center font-headline text-5xl text-white uppercase md:text-7xl">
            {content.heroTitle}
          </h2>
        </div>
      </div>

      <PageBuilderMenuSection
        content={{
          menuColumns: content.menuColumns,
          emptyStateText: content.emptyStateText,
        }}
        columns={2}
        variant="white"
        className="py-0"
        panelClassName="theme-radius-surface rounded-t-none"
      />
    </section>
  );
}