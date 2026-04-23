# Bulwar App - AI Agent Instructions

Welcome to the Bulwar App project. This document serves as the foundation for AI assistants (like GitHub Copilot) to understand the project architecture, tech stack, and workflow.

## 🏗️ Architecture Overview
- **Frontend:** React application generating orders (Catering checkout). Located in `zip/`.
- **Backend Bridge:** A middleware/bridge script that receives orders from React and translates them to WooCommerce Store API calls securely (hiding sensitive keys from the frontend).
- **Core Platform:** WordPress + WooCommerce (installed on a subdomain, later moved to the main domain).
- **Key Features:** 
  - Validates order delivery day and time availability (using Custom Post Types).
  - Calculates delivery costs dynamically via the Google Maps API.

## 🛠️ Tech Stack & Conventions
### React Frontend (`zip/` folder)
- **Framework:** React 19 + TypeScript + Vite.
- **Styling:** Tailwind CSS v4, `clsx`, `tailwind-merge`.
- **UI Components:** Shadcn UI, `@base-ui/react`, Lucide React (Icons), Framer Motion (`motion`) for animations.
- **Forms & Validation:** `react-hook-form` + `zod`.
- **Commands:** 
  - Install dependencies: `npm install` or `yarn` (depending on manager in use)
  - Run dev server: `npm run dev` (starts on port 3000, host 0.0.0.0)
  - Build: `npm run build`

### Bridge & Backend
- (To be implemented): API bridge receiving frontend payloads and securing WooCommerce Store API credentials.

## ⚠️ Strict Rules of Collaboration (CRITICAL)
1. **LIVE DOMAIN SETUP:** aktualny bazowy WordPress (Backend/API) ustalaj wyłącznie na podstawie bieżącej konfiguracji klienta z `/.env.client.local` i wygenerowanych artefaktów bootstrapu. Przed deployem zawsze weryfikuj aktywną domenę backendu zamiast zakładać dawny adres projektu.
2. **NO ASSUMPTIONS:** Never assume anything. It's always better to check twice than to assume. Always verify the current state of files, requirements, and environment before acting.
3. **NO UNAUTHORIZED CHANGES:** Do not introduce code changes or add new features without explicit authorization from the user.
4. **VALIDATE IDEAS:** For larger changes, step back and evaluate if the user's proposed solution is optimal. Suggest better alternatives if they exist.
5. **SECURITY FIRST:** Security is the absolute priority across all layers (Frontend, Bridge, WooCommerce).
6. **STRICT DESIGN ADHERENCE:** Stick strictly to the existing design library. DO NOT create new UI components or introduce new custom styles. Use ONLY the styles and components that are already implemented in the application.
7. **DHOSTING DEPLOYMENT PERMISSIONS (CRITICAL):** Every time you deploy files via SCP to the dhosting server, you MUST execute a follow-up SSH command to fix permissions. Dhosting/LiteSpeed requires directories to be `755` and files to be `644`. Failure to do this results in a white screen / 403 errors. Example: `find path/ -type d -exec chmod 755 {} \; ; find path/ -type f -exec chmod 644 {} \;`

## 📝 Best Practices 
- **Security:** NEVER expose WooCommerce authentication keys or Google Maps backend keys in the React code.
- **Component Design:** Use composition with Shadcn UI and Tailwind. Keep business logic separated from the UI.
- **Routing:** Assume client-side routing unless otherwise specified.

## 🚀 Workflow
When assisting with tasks in this repository, always:
1. Check inside `zip/` for frontend tasks.
2. Adhere to TypeScript strict typings and standard React practices.
3. Validate user inputs thoroughly using Zod before submitting to the bridge.
4. When importing a fresh raw shadcn, v0, or external block for preview, reuse, or registration in `zip/`, first run `npm run normalize:raw-shadcn-typography -- --write <target>` in `zip/`, preserve authored `text-*` classes, and only then adapt the block to the project theme and reusable props.


8. ABSOLUTNY ZAKAZ WŁASNEJ INICJATYWY DOPÓKI NIE ZOSTANIE O TO POPROSZONY.

9. ABSOLUTNY ZAKAZ U�YWANIA KLAS CSS, KOLOR�W I STRUKTUR NIEISTNIEJ�CYCH W PROJEKCIE. ZAKAZ 'ROBIENIA PO SWOJEMU'. ZAWSZE analizuj najpierw poprawne pliki (np. w zip/src/pages/TemplatePage.tsx) i �ci�le na�laduj u�ute tam klasy (np. text-on-surface, font-body, bg-white), marginesy i uk�ad (Navbar, Footer).

10. WORKFLOW BUDOWY FRONTENDU: Gdy wybieramy lub przenosimy nowy komponent lub blok (np. z \components/sections/\ albo z zewnętrznego/raw importu) do użycia na stronie docelowej (np. \HomePage.tsx\), NAJPIERW musimy przetworzyć go do postaci zgodnej z głównym theme CSS aplikacji i istniejącym słownikiem klas projektu. DOPIERO POTEM refaktoryzujemy go tak, aby był w 100% reużywalny (parametryzacja przez React props zamiast tekstów wpisanych na sztywno). DOPIERO NA KOŃCU importujemy go i budujemy z niego stronę.
 `n11. ZAWSZE PAMI�TAJ: Strona /template (plik zip/src/pages/TemplatePage.tsx) pokazuje jak wygl�da prawid�owy, natywny design naszej strony. Opieraj si� o ni� jako �wi�ty wzorzec (marginesy typu `page-margin`, brak bordr�w tam gdzie ich nie ma robionych na si��, odpowiednie paddingi, uk�ad klas i u�ywane kolory z naszej palety).
