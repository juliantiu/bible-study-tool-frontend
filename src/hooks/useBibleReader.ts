import { useContext } from "react";
import { BibleReaderContext } from "../contexts/bible-reader";

export default function useBibleReader() {
  return useContext(BibleReaderContext);
}