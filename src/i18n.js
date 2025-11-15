import React from 'react'; 
import * as flags from 'country-flag-icons/react/3x2';
import enTranslations from '/src/locales/en.json'

export const builtInTranslations = {
  en: enTranslations
};

export const languageToCountry = {
  'ru': 'RU',
  'en': 'GB',
  'jp': 'JP',
  'de': 'DE',
  'fr': 'FR',
  'es': 'ES',
  'it': 'IT',
  'pt': 'BR',
  'zh': 'CN',
  'ko': 'KR',
  'ar': 'SA',
  'tr': 'TR',
  'pl': 'PL',
  'uk': 'UA',
  'cs': 'CZ',
  'nl': 'NL',
  'sv': 'SE',
  'no': 'NO',
  'da': 'DK',
  'fi': 'FI',
  'el': 'GR',
  'he': 'IL',
  'hi': 'IN',
  'th': 'TH',
  'vi': 'VN',
  'id': 'ID',
  'ms': 'MY',
  'tl': 'PH'
};

export const availableLanguages = [
  { code: 'ru', name: 'Русский', countryCode: 'RU' },
  { code: 'en', name: 'English', countryCode: 'GB' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'es', name: 'Español', countryCode: 'ES' },
  { code: 'it', name: 'Italiano', countryCode: 'IT' },
  { code: 'zh', name: '中文', countryCode: 'CN' },
  { code: 'pt', name: 'Português', countryCode: 'PT' },
  { code: 'ar', name: 'العربية', countryCode: 'SA' },
  { code: 'tr', name: 'Türkçe', countryCode: 'TR' },
  { code: 'pl', name: 'Polski', countryCode: 'PL' },
  { code: 'jp', name: '日本語', countryCode: 'JP' },
  { code: 'ua', name: 'Українська', countryCode: 'UA' }
];

export const getFlag = (langCode) => {
  const countryCode = languageToCountry[langCode] || langCode.toUpperCase();
  const FlagComponent = flags[countryCode];
  return FlagComponent || flags.GB;
};

export const loadTranslations = async (lang) => {
  if (builtInTranslations[lang]) {
    return builtInTranslations[lang];
  }
  
  try {
    const translations = await import(`../src/locales/${lang}.json`);
    builtInTranslations[lang] = translations.default;
    return translations.default;
  } catch (error) {
    console.warn(`Translations for ${lang} not found, falling back to English`);
    return builtInTranslations.en;
  }
};

export function useTranslation(lang = 'ru') {
  const [translations, setTranslations] = React.useState(builtInTranslations[lang] || builtInTranslations.en);
  const [loading, setLoading] = React.useState(!builtInTranslations[lang]);

  React.useEffect(() => {
    if (builtInTranslations[lang]) {
      setTranslations(builtInTranslations[lang]);
      setLoading(false);
    } else {
      setLoading(true);
      loadTranslations(lang).then(loadedTranslations => {
        setTranslations(loadedTranslations);
        setLoading(false);
      });
    }
  }, [lang]);

  const t = (key) => {
    return translations?.[key] || builtInTranslations.en?.[key] || key;
  };

  return { t, loading };
}