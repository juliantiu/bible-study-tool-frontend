import { useContext } from "react";
import { BackendConnectionContext } from "../contexts/backend-connection";

export default function useBackendConnection() {
  return useContext(BackendConnectionContext);
}