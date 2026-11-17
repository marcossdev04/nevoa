"use client";

import { useEffect } from "react";
import { initStore } from "@/lib/runtime";

/** Liga as interações da loja depois que a página está na tela. Não renderiza nada. */
export function StoreRuntime() {
  useEffect(() => initStore(), []);
  return null;
}
