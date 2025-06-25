// src/utils/currency.ts

import countries from "i18n-iso-countries";
import currencyList from "currency-codes";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register English locale for country names
countries.registerLocale(enLocale);

// Build a dynamic map: Country → Currency (ISO 4217)
export const countryToCurrency: Record<string, string> = {};

for (const code of currencyList.codes()) {
  const currency = currencyList.code(code);
  if (!currency?.countries) continue;

  for (const countryName of currency.countries) {
    // Get ISO alpha-2 from English country name
    const alpha2 = countries.getAlpha2Code(countryName, "en");
    if (!alpha2) continue;
    const alpha3 = countries.alpha2ToAlpha3(alpha2)!;
    const upperName = countryName.trim().toUpperCase();

    countryToCurrency[alpha2]   = code;
    countryToCurrency[alpha3]   = code;
    countryToCurrency[upperName] = code;
  }
}

// Normalize arbitrary country input to ISO alpha-2
export function normalizeCountry(input: string): string {
  if (!input) return "";
  const key = input.trim().toUpperCase();

  // Direct match on alpha-2, alpha-3 or uppercase name
  if (countryToCurrency[key]) {
    if (key.length === 2 && countries.isValid(key)) {
      return key;
    }
    const fromName = countries.getAlpha2Code(key, "en");
    return fromName ?? key;
  }

  // Italian-language fallbacks
  const alias: Record<string, string> = {
    ITALIA:        "IT",
    FRANCIA:       "FR",
    GERMANIA:      "DE",
    SPAGNA:        "ES",
    GIAPPONE:      "JP",
    SVIZZERA:      "CH",
    "STATI UNITI": "US",
    "REGNO UNITO": "GB",
    UK:            "GB",
  };
  if (alias[key]) return alias[key];

  // Fallback: first two letters
  return key.slice(0, 2);
}

// Convert arbitrary input to ISO alpha-3 country code
export function toAlpha3Country(input: string): string {
  const alpha2 = normalizeCountry(input);
  const alpha3 = countries.alpha2ToAlpha3(alpha2);
  return alpha3 ?? alpha2;
}

// Get currency code (ISO 4217 alpha-3) for a given ISO alpha-3 country code
export function getCurrencyForCountry(alpha3: string): string {
  return countryToCurrency[alpha3] ?? "";
}

// Normalize currency code to ISO 4217 alpha-3
export function normalizeCurrency(input: string): string {
  if (!input) return "";
  return input.trim().toUpperCase().slice(0, 3);
}

// Fetch current exchange rate: how many units of `currency` equal 1 EUR
const EXCHANGE_BASE =
  process.env.NEXT_PUBLIC_EXCHANGE_RATE_URL ??
  "https://api.exchangerate.host";

export async function fetchExchangeRate(currency: string): Promise<number> {
  if (!currency || normalizeCurrency(currency) === "EUR") {
    return 1;
  }

  try {
    const to = normalizeCurrency(currency);
    const res = await fetch(
      `${EXCHANGE_BASE.replace(/\/$/, "")}/convert?from=EUR&to=${to}&amount=1`
    );
    if (!res.ok) {
      return 0;
    }
    const data = await res.json();
    return data?.info?.rate ?? data?.result ?? 0;
  } catch (err) {
    console.error("Errore fetchExchangeRate:", err);
    return 0;
  }
}

// Calculate total in EUR given amount, tip, exchange rate and optional markup percent
export function calcEuro(
  total: number,
  tip: number,
  exchange: number,
  percent?: number
): number {
  let euro = exchange > 0 ? (total + tip) / exchange : 0;
  if (percent && percent > 0) {
    euro = euro * (1 + percent / 100);
  }
  return Number(euro.toFixed(2));
}
