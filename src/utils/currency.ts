// src/utils/currency.ts

// Mapping rapido Paese -> Valuta (puoi estendere, qui alcuni esempi)
export const countryToCurrency: Record<string, string> = {
  IT: "EUR", ITA: "EUR", FR: "EUR", FRA: "EUR",
  ES: "EUR", ESP: "EUR", DE: "EUR", GER: "EUR",
  US: "USD", USA: "USD", GB: "GBP", UK: "GBP",
  BR: "BRL", BRA: "BRL", JP: "JPY", JPN: "JPY",
  // aggiungi altri a piacere...
};

// Funzione di normalizzazione ISO paese (es: "italy" → "IT")
export function normalizeCountry(input: string): string {
  if (!input) return "";
  const code = input.trim().toUpperCase();
  if (countryToCurrency[code]) return code;
  // mini mapping (esempio)
  if (["ITALY", "ITALIA"].includes(code)) return "IT";
  if (["FRANCE", "FRANCIA"].includes(code)) return "FR";
  if (["USA", "UNITED STATES", "STATI UNITI"].includes(code)) return "US";
  if (["BRAZIL", "BRASILE"].includes(code)) return "BR";
  if (["SPAIN", "SPAGNA"].includes(code)) return "ES";
  if (["GERMANY", "GERMANIA"].includes(code)) return "DE";
  if (["JAPAN", "GIAPPONE"].includes(code)) return "JP";
  // fallback
  return code.slice(0, 2); // es: "ITA" -> "IT"
}

// Funzione di normalizzazione valuta
export function normalizeCurrency(input: string): string {
  if (!input) return "";
  return input.trim().toUpperCase().slice(0, 3);
}

// Fetch cambio valuta (1 EUR = ? altra valuta) – ritorna numero
export async function fetchExchangeRate(currency: string): Promise<number> {
  if (!currency || currency === "EUR") return 1;
  const url = `https://api.exchangerate.host/convert?from=EUR&to=${currency}&amount=1`;
  const res = await fetch(url);
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.info?.rate || data?.result || 0;
}

// Calcolo Totale€ (total + tip) / cambio
export function calcEuro(total: number, tip: number, exchange: number, percent?: number): number {
  let euro = exchange > 0 ? (Number(total) + Number(tip)) / exchange : 0;
  if (percent && percent > 0) euro = euro * (1 + percent / 100);
  return Number(euro.toFixed(2));
}
