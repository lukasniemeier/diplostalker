export interface DiplomaticCode {
  code: string;
  nameDe: string;
  nameEn: string;
  flag: string;
  type: 'country' | 'organization';
}

export type Tab = 'search' | 'history';
export type Language = 'de' | 'en';

export interface HistoryItem {
  code: string;
  result: DiplomaticCode;
  timestamp: number;
}
