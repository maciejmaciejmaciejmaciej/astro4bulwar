export interface ParsedSpecialMenuFor2Summary {
  personLabel: string;
  items: [string, string];
}

const SPECIAL_MENU_FOR_2_SUMMARY_PATTERN = /^(Osoba\s+\d+):\s*Zupa\s+(.+?)\s*\/\s*Danie(?:\s+główne)?\s+(.+)$/i;

export const parseSpecialMenuFor2SummaryLine = (
  line: string,
): ParsedSpecialMenuFor2Summary | null => {
  const normalizedLine = line.trim();
  const match = SPECIAL_MENU_FOR_2_SUMMARY_PATTERN.exec(normalizedLine);

  if (!match) {
    return null;
  }

  const [, personLabel, soupLabel, mainLabel] = match;

  return {
    personLabel,
    items: [`Zupa: ${soupLabel.trim()}`, `Danie główne: ${mainLabel.trim()}`],
  };
};