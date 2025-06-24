// src/hooks/useCostiAutoCalc.ts
import { useCallback } from "react";
import { fetchExchangeRate, calcEuro, countryToCurrency, normalizeCountry, normalizeCurrency } from "@/utils/currency";

// Definisci il tipo riga (CostiRow) – modifica se già definito altrove!
export interface CostiRow {
  id: string | number;
  name: string;
  country: string;
  currency: string;
  total: number;
  tip?: number;
  exchangeRate: number;
  percent?: number;
  totalEur: number;
  // ...altri campi se servono
}

/**
 * Hook che restituisce una funzione per gestire aggiornamenti automatici sulle celle della tabella Costi.
 * 
 * @param setData funzione di aggiornamento dati (es: setData di useState)
 */
export function useCostiAutoCalc(setData: (cb: (old: CostiRow[]) => CostiRow[]) => void) {

  // Handler da usare su ogni onChange/onBlur delle celle editabili
  const handleCellChange = useCallback(async (rowIdx: number, columnId: string, value: any, data: CostiRow[]) => {
    // 1. Crea nuova copia dati
    let newRows = [...data];
    let row = { ...newRows[rowIdx] };
    (row as any)[columnId] = value;

    // 2. Auto-mapping country/currency
    if (columnId === "country") {
      row.country = normalizeCountry(value);
      row.currency = countryToCurrency[row.country] || row.currency;
    }
    if (columnId === "currency") {
      row.currency = normalizeCurrency(value);
    }

    // 3. Recupera cambio automatico se cambia la valuta
    if (["currency", "country"].includes(columnId)) {
      row.exchangeRate = await fetchExchangeRate(row.currency);
    }

    // 4. Ricalcola Totale€
    row.totalEur = calcEuro(
      row.total ?? 0,
      row.tip ?? 0,
      row.exchangeRate ?? 1,
      row.percent ?? 0
    );

    // 5. Aggiorna riga
    newRows[rowIdx] = row;
    setData(() => newRows);
  }, [setData]);

  return { handleCellChange };
}
