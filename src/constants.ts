import { Language } from './types';

export const translations = {
  de: {
    search: 'Suche',
    history: 'Verlauf',
    hint: 'Geben Sie die Zahl vom Kennzeichen ein.',
    noResult: 'Kein Ergebnis gefunden',
    country: 'Land',
    organization: 'Organisation',
    clearHistory: 'Verlauf löschen',
    emptyHistory: 'Noch keine Suchanfragen',
    justNow: 'Gerade eben',
    minutesAgo: ' Minuten her',
    hoursAgo: ' Stunden her',
    daysAgo: ' Tage her',
    pwaReady: 'App ist bereit für den Offline-Betrieb',
    pwaUpdate: 'Neue Version verfügbar!',
    pwaReload: 'Aktualisieren',
  },
  en: {
    search: 'Search',
    history: 'History',
    hint: 'Enter the code from the license plate.',
    noResult: 'No result found',
    country: 'Country',
    organization: 'Organization',
    clearHistory: 'Clear history',
    emptyHistory: 'Here be dragons.',
    justNow: 'Just now',
    minutesAgo: ' m ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
    pwaReady: 'App ready to work offline',
    pwaUpdate: 'New version available!',
    pwaReload: 'Update',
  }
} as const;

export type TranslationType = typeof translations[Language];
