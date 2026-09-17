"use client";

import { useSyncExternalStore, useCallback } from "react";
import { CalcMode } from "@/components/calculator-form";

const STORAGE_KEYS = {
  MODE: "ebc-mode",
  UNITS: "ebc-units",
  AMOUNT: "ebc-amount",
  DEMAND: "ebc-demand",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export interface CalculatorSnapshot {
  mode: CalcMode;
  units: number;
  amount: number;
  demand: number;
  isHydrated: boolean;
}

const SERVER_SNAPSHOT: CalculatorSnapshot = {
  mode: "units",
  units: 150,
  amount: 1500,
  demand: 1,
  isHydrated: false,
};

function readStorageSnapshot(): CalculatorSnapshot {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const rawMode = localStorage.getItem(STORAGE_KEYS.MODE);
    const rawUnits = localStorage.getItem(STORAGE_KEYS.UNITS);
    const rawAmount = localStorage.getItem(STORAGE_KEYS.AMOUNT);
    const rawDemand = localStorage.getItem(STORAGE_KEYS.DEMAND);

    const mode: CalcMode =
      rawMode === "amount"
        ? "amount"
        : rawMode === "appliances"
        ? "appliances"
        : "units";

    const units =
      rawUnits !== null && !isNaN(parseFloat(rawUnits))
        ? Math.max(0, parseFloat(rawUnits))
        : 150;
    const amount =
      rawAmount !== null && !isNaN(parseFloat(rawAmount))
        ? Math.max(0, parseFloat(rawAmount))
        : 1500;
    const demand =
      rawDemand !== null && !isNaN(parseFloat(rawDemand))
        ? Math.max(0, parseFloat(rawDemand))
        : 1;

    return { mode, units, amount, demand, isHydrated: true };
  } catch {
    return { ...SERVER_SNAPSHOT, isHydrated: true };
  }
}

// Client synchronous snapshot
let currentSnapshot: CalculatorSnapshot =
  typeof window !== "undefined" ? readStorageSnapshot() : SERVER_SNAPSHOT;

const listeners = new Set<() => void>();

function notify() {
  currentSnapshot = readStorageSnapshot();
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key && Object.values(STORAGE_KEYS).includes(e.key as StorageKey)) {
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCalculatorStore() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => currentSnapshot,
    () => SERVER_SNAPSHOT
  );

  const setMode = useCallback((newMode: CalcMode) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, newMode);
      notify();
    } catch {}
  }, []);

  const setUnits = useCallback((newUnits: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.UNITS, String(newUnits));
      notify();
    } catch {}
  }, []);

  const setAmount = useCallback((newAmount: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.AMOUNT, String(newAmount));
      notify();
    } catch {}
  }, []);

  const setDemand = useCallback((newDemand: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMAND, String(newDemand));
      notify();
    } catch {}
  }, []);

  return {
    mode: snapshot.mode,
    units: snapshot.units,
    amount: snapshot.amount,
    demand: snapshot.demand,
    isHydrated: snapshot.isHydrated,
    setMode,
    setUnits,
    setAmount,
    setDemand,
  };
}
