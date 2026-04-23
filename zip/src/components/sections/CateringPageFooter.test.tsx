import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { CateringPageFooter } from "./CateringPageFooter";

const socialLinks = [
  { label: "Facebook", url: "https://www.facebook.com/bulwaRrestauracja/" },
  { label: "Instagram", url: "https://www.instagram.com/bulwar/" },
  {
    label: "Tripadvisor",
    url: "https://pl.tripadvisor.com/Restaurant_Review-g274847-d10184406-Reviews-Bulwar-Poznan_Greater_Poland_Province_Central_Poland.html",
  },
] as const;

const legalLinks = [
  { label: "Polityka prywatnosci", url: "https://bulwarrestauracja.pl/polityka-prywatnosci/" },
  { label: "Regulamin", url: "https://bulwarrestauracja.pl/regulamin/" },
] as const;

test("CateringPageFooter renders the real BulwaR footer content and links", () => {
  const markup = renderToStaticMarkup(
    <CateringPageFooter
      logoSrc="/react/images/logo.png"
      socialLinks={socialLinks}
      legalLinks={legalLinks}
    />,
  );

  assert.match(markup, /Restauracja &quot;BulwaR&quot;/);
  assert.match(markup, /Stary Rynek 37/);
  assert.match(markup, /Poznań/);
  assert.match(markup, /\+48 533 181 171/);
  assert.match(markup, /rezerwacje@bulwarrestauracja\.pl/);
  assert.match(markup, /Codziennie od 09\.00 do 23\.00/);
  assert.match(markup, /www\.bulwarrestauracja\.pl/);
  assert.match(markup, /Polityka prywatnosci/);
  assert.match(markup, /Restauracja BulwaR 2026 wszelkie prawa zastrzeżone/);
  assert.doesNotMatch(markup, /ANDÉ|LOCATION|CONTACT|HOURS|hello@andecurator/);
});