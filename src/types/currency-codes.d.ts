// src/types/currency-codes.d.ts

declare module "currency-codes" {
  export interface Currency {
    /** Codice ISO 4217, es. "EUR" */
    code: string;
    /** Numero ISO, es. "978" */
    number: string;
    /** Cifre decimali, es. 2 */
    digits: number;
    /** Nome valuta, es. "Euro" */
    currency: string;
    /** Elenco di nazioni in cui è usata */
    countries: string[];
    /** Unità minori */
    minorUnits: number;
  }

  /** Restituisce i dettagli di una valuta ISO 4217 */
  export function code(code: string): Currency | undefined;
  /** Tutti i codici ISO 4217 */
  export function codes(): string[];

  const currency: {
    code: typeof code;
    codes: typeof codes;
  };
  export default currency;
}
