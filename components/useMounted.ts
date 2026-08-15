"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Devuelve false en el servidor y en el primer render del cliente, y true una
 * vez montado — sin efectos ni setState (evita la regla set-state-in-effect y
 * los desajustes de hidratación). Útil para leer localStorage con seguridad.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
