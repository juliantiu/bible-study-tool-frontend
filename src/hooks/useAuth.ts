import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

export default function useBibleReader() {
  return useContext(AuthContext);
}