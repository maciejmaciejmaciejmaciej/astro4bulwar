import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projects17aProp = [
  {
    id: 1,
    title: "Crystal Clear Tropical Waters",
    location: "Maldives",
    year: "2023",
    category: "Seascape",
    description:
      "Aerial view of pristine turquoise waters revealing the intricate patterns of coral formations and sandy ocean floor through crystal clear tropical seas.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/jeremy-bishop-iEjCQtcsVPY-unsplash.jpg",
  },
  {
    id: 2,
    title: "Aerial View of Rice Terraces",
    location: "Southeast Asia",
    year: "2023",
    category: "Agriculture",
    description:
      "Stunning aerial perspective of terraced rice fields showcasing intricate geometric patterns and vibrant green landscapes carved into the hillsides.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/ivan-bandura-hqnUYXsN5oY-unsplash.jpg",
  },
  {
    id: 3,
    title: "Desert Canyon Formations",
    location: "Southwestern United States",
    year: "2022",
    category: "Landscape",
    description:
      "Dramatic aerial view of layered sandstone formations revealing millions of years of geological history through deep canyons and weathered rock strata.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/ivan-bandura-3QqzCTIfUJI-unsplash.jpg",
  },
  {
    id: 4,
    title: "Golden Terraced Fields",
    location: "Yunnan, China",
    year: "2022",
    category: "Agriculture",
    description:
      "Mesmerizing aerial view of golden terraced agricultural fields displaying intricate contour patterns carved into the mountainous landscape during harvest season.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/kevin-charit-1fL2Q1JcbNc-unsplash.jpg",
  },
  {
    id: 5,
    title: "Tidal Sand Patterns",
    location: "Iceland",
    year: "2023",
    category: "Landscape",
    description:
      "Mesmerizing aerial view of flowing water patterns carved into dark volcanic sand, creating organic sculptural forms shaped by tidal forces.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/ines-alvarez-fdez-VjRc6HDXJ5s-unsplash.jpg",
  },
  {
    id: 6,
    title: "Red Rock Canyon Labyrinth",
    location: "Utah, United States",
    year: "2022",
    category: "Landscape",
    description:
      "Breathtaking aerial view of red sandstone canyon formations displaying deep gorges, weathered rock layers, and intricate geological patterns carved over millennia.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/john-murphey-ZWUWSEY6OGk-unsplash.jpg",
  },
];

interface Projects17aProps {
  className?: string;
}

export const Projects17a = ({ className }: Projects17aProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

      setCanScrollPrev(scrollContainer.scrollLeft > 8);
      setCanScrollNext(scrollContainer.scrollLeft < maxScrollLeft - 8);
    };

    updateScrollState();

    scrollContainer.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      scrollContainer.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollByCardWidth = (direction: "prev" | "next") => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const firstCard = scrollContainer.querySelector<HTMLElement>("[data-project-card]");
    const cardWidth = firstCard?.offsetWidth ?? 700;
    const gap = 32;
    const nextScrollLeft = direction === "next"
      ? scrollContainer.scrollLeft + cardWidth + gap
      : scrollContainer.scrollLeft - cardWidth - gap;

    scrollContainer.scrollTo({
      left: nextScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("theme-block-section", className)}>
      <div className="theme-block-shell">
        <div className="theme-block-header">
          <h2 className="theme-block-heading">
          Projects
          </h2>
          <p className="mt-4 max-w-2xl theme-block-copy">
            Minimal showcase with cinematic aspect ratio.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 pt-1"
          >
            {projects17aProp.map((project) => (
              <article
                key={project.id}
                data-project-card
                className="w-[82vw] max-w-[700px] min-w-[280px] flex-none snap-start space-y-4 md:w-[700px]"
              >
                <div className="theme-block-card theme-block-media aspect-video">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-headline text-2xl text-foreground md:text-3xl" style={{ lineHeight: 1.15, letterSpacing: "var(--tracking-tight)" }}>
                      {project.title}
                    </h3>
                    <span className="theme-block-badge">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <p className="theme-block-meta">{project.location}</p>
                    <p className="theme-block-meta">{project.year}</p>
                  </div>

                  <p className="max-w-2xl theme-block-copy">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-1.5rem)] z-10 hidden -translate-y-1/2 justify-between md:flex">
            <Button
              size="icon-lg"
              variant="outline"
              onClick={() => scrollByCardWidth("prev")}
              disabled={!canScrollPrev}
              className="pointer-events-auto shadow-sm"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon-lg"
              variant="outline"
              onClick={() => scrollByCardWidth("next")}
              disabled={!canScrollNext}
              className="pointer-events-auto shadow-sm"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};