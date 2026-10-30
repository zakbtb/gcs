"use client";

import { useEffect } from "react";
import { usePanier } from "@/components/panier/PanierProvider";

export function ViderPanier() {
  const { vider, pret } = usePanier();
  useEffect(() => {
    if (pret) vider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret]);
  return null;
}
