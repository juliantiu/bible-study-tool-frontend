import { BIBLE_BOOK_KEYS } from "./static-references-util";

export function getBibleBookOrder(key: string) {
  return BIBLE_BOOK_KEYS.findIndex(k => k === key) + 1;
}