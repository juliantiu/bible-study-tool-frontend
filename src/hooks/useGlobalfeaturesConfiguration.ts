import { useContext } from "react";
import { GlobalFeaturesConfigurationContext } from "../contexts/gloabl-features-confirguration";

export default function useGlobalFeaturesConfiguration() {
  return useContext(GlobalFeaturesConfigurationContext);
}