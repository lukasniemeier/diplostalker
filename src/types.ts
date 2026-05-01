export interface DiplomaticCode {
  code: string;
  nameDe: string;
  nameEn: string;
  flag: string;
  type: 'mission' | 'organization';
}

export type Tab = 'search' | 'history';
export type Language = 'de' | 'en';

export interface CollectionItem {
  code: string;
  result: DiplomaticCode;
  firstSeen?: number;
  lastSeen?: number;
  timestamp?: number;
}
