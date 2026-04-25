import { HeroSection } from "../components/sections/HeroSection";
import { ModernInterior } from "../components/sections/ModernInterior";
import { CateringSection } from "../components/sections/CateringSection";
import { RegionalCuisine } from "../components/sections/RegionalCuisine";
import { OfertaSection } from "../components/sections/OfertaSection";
import { GallerySection } from "../components/sections/GallerySection";
import { Heart, ConciergeBell } from "lucide-react";
import { portfolioItems } from "../data/ofertaData";
import {
  promo3BlockDefinition,
  promo3DefaultData,
} from "../blocks/promo3/schema";
import {
  storyTeamShowcaseBlockDefinition,
  storyTeamShowcaseDefaultData,
} from "../blocks/story-team-showcase/schema";
import { parsePageBuilderSchema } from "../blocks/registry/pageBuilderSchema";
import { renderPageBuilderSections } from "../blocks/registry/renderPageBuilderSections";

const HOME_PAGE_PROMO3_SCHEMA = parsePageBuilderSchema({
  version: 1,
  page: {
    slug: "home",
    title: "Home",
    status: "published",
  },
  sections: [
    {
      id: "home-promo3-01",
      blockKey: promo3BlockDefinition.blockKey,
      blockVersion: promo3BlockDefinition.version,
      variant: null,
      enabled: true,
      data: promo3DefaultData,
      source: null,
      meta: {},
    },
  ],
});

const HOME_PAGE_STORY_TEAM_SHOWCASE_SCHEMA = parsePageBuilderSchema({
  version: 1,
  page: {
    slug: "home",
    title: "Home",
    status: "published",
  },
  sections: [
    {
      id: "home-story-team-showcase-01",
      blockKey: storyTeamShowcaseBlockDefinition.blockKey,
      blockVersion: storyTeamShowcaseBlockDefinition.version,
      variant: null,
      enabled: true,
      data: storyTeamShowcaseDefaultData,
      source: null,
      meta: {},
    },
  ],
});

export default function HomePage() {
  return (
      <main className="overflow-hidden">
        <HeroSection 
          title="BulwaR"
          imageSrc="/react/images/home_hero.jpg"
        />

        <ModernInterior 
          title="O restauracji"
          paragraphs={[
            "Od 2011 roku prowadzimy restaurację z autorską kuchnią, w której czerpiemy z dobrych, sprawdzonych tradycji kuchni europejskiej. Naszym głównym założeniem przy kreowaniu nowych dań jest smak.",
            "Z przyjemnością ugościmy Państwa na wyjątkowym lunchu, eleganckiej kolacji, a także w niedzielne przedpołudnia przy obfitym rodzinnym stole. W letnie dni udostępniamy zielony ogródek letni, który staje się oazą, osłoniętą od miejskiego hałasu."
          ]}
          buttonText="CZYTAJ WIĘCEJ"
          buttonLink="/o-restauracji"
          image1Src="/react/images/about_1.jpg"
          image1Alt="Wnętrze restauracji"
          image2Src="/react/images/about_front.jpg"
          image2Alt="Detale dekoracji"
        />

        <CateringSection 
          heading="Catering Wielkanocny"
          description="Zamów z dostawą lub obiorem własnym. Najwyższa jakość i starannie wyselekcjonowane, wielkanocne tradycje prosto na Twój stół."
          buttonText="ZAMÓW ONLINE"
          buttonHref="/catering-wielkanocny"
          brandName="BulwaR"
          logoSrc="/react/images/logo.png"
          images={[
            { src: "/react/images/zupy-catering.jpg" },
            { src: "/react/images/sniadanie-wielkanocne.jpg" },
            { src: "/react/images/ciasta-catering.jpg" },
            { src: "/react/images/dla-dzieci.jpg" },
            { src: "/react/images/chleb-pieczywo.jpg" },
            { src: "/react/images/dania-glowne.jpg" },
            { src: "/react/images/piers-z-kaczki.jpg" }
          ]}
        />

        <RegionalCuisine
          title={<>Kuchnia <br />regionalna</>}
          description="Restauracja Bulwar na Starym Rynku w Poznaniu oferuje niecodzienne połączenie tradycyjnej, regionalnej kuchni z nowoczesnymi trendami w gotowaniu."
          actions={[
            {
              icon: Heart,
              title: <>Zobacz menu a'la<br />carte</>,
              description: "Wyjątkowe dania na bazie ekologicznych produktów z regionu",
              href: "/menu",
              linkLabel: "Zobacz menu",
            },
            {
              icon: ConciergeBell,
              title: <>Zorganizujemy Twoje<br />przyjęcie</>,
              description: "Imprezy okolicznościowe na najwyższym poziomie",
              href: "/oferta",
              linkLabel: "Zobacz ofertę",
            },
          ]}
          imageSrc="/react/images/widok-na-ratusz.jpg"
          imageAlt="Widok na Stary Rynek w Poznaniu"
        />

        {renderPageBuilderSections(HOME_PAGE_PROMO3_SCHEMA)}
        
        <GallerySection />

        <OfertaSection items={portfolioItems} title="Nasza Oferta" />

        {renderPageBuilderSections(HOME_PAGE_STORY_TEAM_SHOWCASE_SCHEMA)}

      </main>
  );
}
