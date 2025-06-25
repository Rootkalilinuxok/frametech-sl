// src/types/i18n-iso-countries.d.ts
declare module "i18n-iso-countries" {
  interface CountryMap {
    [code: string]: string;
  }
  interface CountryLocale {
    [code: string]: string;
  }

  function registerLocale(data: CountryLocale): void;
  function getAlpha2Code(name: string, locale: string): string | undefined;
  function alpha2ToAlpha3(alpha2: string): string | undefined;
  function isValid(alpha2: string): boolean;
  function getNames(locale: string): CountryMap;

  const countries: {
    registerLocale: typeof registerLocale;
    getAlpha2Code: typeof getAlpha2Code;
    alpha2ToAlpha3: typeof alpha2ToAlpha3;
    isValid: typeof isValid;
    getNames: typeof getNames;
  };
  export = countries;
}
