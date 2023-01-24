export interface SearchSettings {
  verseOrder: SearchSettingsVerseOrder;
  removeDuplicates: boolean;
}

export enum SearchSettingsVerseOrder {
  default = 0,
  ascending,
  descending
}

export enum SearchType {
  verses,
  keywords
}