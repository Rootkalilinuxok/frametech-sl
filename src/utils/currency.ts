// src/utils/currency.ts

// Mappa Paesi → Valute (alpha-2, alpha-3, nomi)
export const countryToCurrency: Record<string, string> = {
  AU: "AUD", AUS: "AUD", AUSTRALIA: "AUD",
  BR: "BRL", BRA: "BRL", BRAZIL: "BRL",
  CA: "CAD", CAN: "CAD", CANADA: "CAD",
  CN: "CNY", CHN: "CNY", CHINA: "CNY",
  FR: "EUR", FRA: "EUR", FRANCE: "EUR",
  DE: "EUR", DEU: "EUR", GERMANY: "EUR",
  IN: "INR", IND: "INR", INDIA: "INR",
  IT: "EUR", ITA: "EUR", ITALY: "EUR",
  JP: "JPY", JPN: "JPY", JAPAN: "JPY",
  RU: "RUB", RUS: "RUB", "RUSSIAN FEDERATION": "RUB",
  CH: "CHF", CHE: "CHF", SWITZERLAND: "CHF",
  GB: "GBP", GBR: "GBP", "UNITED KINGDOM": "GBP",
  US: "USD", USA: "USD", "UNITED STATES": "USD",
  // estendibile con altri paesi
};

// Normalizza input paese in ISO alpha-2 (es. "Italy" → "IT")
export function normalizeCountry(input: string): string {
  if (!input) return "";
  const code = input.trim().toUpperCase();

  // Se già presente come chiave, restituisci quella
  if (countryToCurrency[code]) return code;

  // Alcuni fallback noti (es. alias incompleti)
  if (["ITALIA"].includes(code)) return "IT";
  if (["FRANCIA"].includes(code)) return "FR";
  if (["GERMANIA"].includes(code)) return "DE";
  if (["SPAGNA", "SPAIN"].includes(code)) return "ES";
  if (["GIAPPONE"].includes(code)) return "JP";
  if (["SVIZZERA"].includes(code)) return "CH";
  if (["STATI UNITI"].includes(code)) return "US";
  if (["REGNO UNITO", "UK"].includes(code)) return "GB";

  // Estrai prime due lettere come fallback
  return code.slice(0, 2);
}

// Normalizza codice valuta (es. "eur" → "EUR")
export function normalizeCurrency(input: string): string {
  if (!input) return "";
  return input.trim().toUpperCase().slice(0, 3);
}

// Ottieni il tasso di cambio attuale: 1 EUR = ? altra valuta
export async function fetchExchangeRate(currency: string): Promise<number> {
  if (!currency || currency === "EUR") return 1;
  try {
    const url = `https://api.exchangerate.host/convert?from=EUR&to=${currency}&amount=1`;
    const res = await fetch(url);
    if (!res.ok) return 0;
    const data = await res.json();
    return data?.info?.rate || data?.result || 0;
  } catch (err) {
    console.error("Errore fetchExchangeRate:", err);
    return 0;
  }
}

// Calcola il totale in Euro partendo da totale + mancia / cambio
export function calcEuro(total: number, tip: number, exchange: number, percent?: number): number {
  let euro = exchange > 0 ? (Number(total) + Number(tip)) / exchange : 0;
  if (percent && percent > 0) euro = euro * (1 + percent / 100);
  return Number(euro.toFixed(2));
}
