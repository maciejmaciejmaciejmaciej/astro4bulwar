# Homepage Content Mapping Proposal

This document outlines how the existing content and structure from the old WordPress homepage (`content.md`) maps to the proposed new React component structure in `HomePage.tsx`.

## 1. HeroSection
**Source Content:**
- **H1:** Catering Świąteczny / Wigilia firmowa na Starym Rynku w Poznaniu
- **H4:** Catering Świąteczny 2025
- **Buttons / Actions:** Zobacz menu, Zamów online, Check menu 

**Proposed React Implementation:**
- Animated hero area featuring the main promotional content.
- Include background images (`hero_inner_page4.jpg`) or sliders for the promos.
- CTA buttons directing to Catering and Event pages.

## 2. WiniarniaSection
**Source Content:**
- **H1:** Winiarnia w Bulwarze
- **H4:** Zapraszamy do naszej winiarni
- **Button / Action:** więcej… (links to Karta Win)

**Proposed React Implementation:**
- A dedicated section highlighting the wine selection.
- Elegant typography combined with a specific CTA button linking to `/menu/karta-win/`.

## 3. WynosSection
**Source Content:**
- **H2:** BulwaR na wynos
- **Content:** Dowozy, MENU Zamów online

**Proposed React Implementation:**
- A clean, modern section pointing users to the delivery/takeout options.
- Links out to the delivery endpoints.

## 4. KuchniaRegionalnaSection
**Source Content:**
- **H1:** Kuchnia regionalna
- **H4:** Zobacz menu a’la carte / Zorganizujemy Twoje przyjęcie
- **Button / Action:** Zobacz menu (`/menu/dania-glowne/`), Zobacz ofertę (`/oferta/`)

**Proposed React Implementation:**
- A feature grid or split-screen design.
- Promotes the à la carte menu and private events (przyjęcia).
- Dual CTA strategy.

## 5. KawaSection
**Source Content:**
- **H1:** Kawa na wynos w Bulwarze!
- **Content:** "Wiemy jak ważna jest kawa. Aby była dobra, aby smakowała tak jak lubisz..."
- **Button / Action:** Zobacz menu sniadaniowe (`/menu/sniadania-breakfast/`)

**Proposed React Implementation:**
- A cozy, lifestyle-oriented section detailing coffee options (krowie, sojowe, bez laktozy, owsiane, bez kofeiny).
- Connects nicely to the breakfast menu CTA.

## 6. LunchSection
**Source Content:**
- **H1:** Masz bardzo ważny lunch!
- **Content:** "Regionalne produkty oraz najwyższej jakości składniki tworzące dania to codzienność..."
- **Button / Action:** Menu lunch (`/menu/lunch/`)

**Proposed React Implementation:**
- A focused business/lunch segment.
- Clear messaging about quality ingredients with a direct CTA to the lunch menu.

## 7. AktualnosciSection
**Source Content:**
- **H1:** Oferta specjalna
- **H3:** Aktualności
- **Content / Events:** test, 25.11.24 do 23.12.24 (Sprzedaż świątecznego cateringu), 25.11.24 do 12.01.25 (Terminy)

**Proposed React Implementation:**
- A dynamic grid or carousel of news/events.
- Will likely need an update/sync mechanism or static mapping depending on how often this changes.

## 8. TarczaSection
**Source Content:**
- **H3:** Informacja
- **Content:** "Przedsiębiorca uzyskał subwencję finansową w ramach programu rządowego 'Tarcza Finansowa 2.0...'"

**Proposed React Implementation:**
- A subtle, text-based informative banner/footer-like section to fulfill legal/grant requirements without distracting from the main design.

## 9. OpinieSection
**Source Content:**
- **H3:** “Amazing food and experience”
- **H4:** Jennifer

**Proposed React Implementation:**
- A testimonial carousel or highlighted quote block.
- Adds social proof right before the footer.

---
**Global UI Elements (Header / Menu / Footer):**
Content like:
- Main navigation links (Catering Świąteczny, O restauracji, Dowozy, Menu, Oferta, Galeria, Kontakt)
- Footer info (Restauracja BulwaR, adres, godziny otwarcia, nr telefonu, polityka prywatności, regulamin)
Will be handled by the global `RootLayout.tsx` components (Navbar and Footer modules).