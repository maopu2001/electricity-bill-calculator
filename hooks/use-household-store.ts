"use client";

import { useSyncExternalStore, useCallback } from "react";
import { UserAppliance } from "@/lib/appliance-types";
import { HOUSEHOLD_TEMPLATES } from "@/lib/appliance-templates";
import { generateApplianceId } from "@/lib/utils";

const STORAGE_KEY = "ebc-household-appliances";

const DEFAULT_APPLIANCES: UserAppliance[] =
  HOUSEHOLD_TEMPLATES.find((t) => t.id === "empty")?.appliances || [];

interface HouseholdSnapshot {
  appliances: UserAppliance[];
  isHydrated: boolean;
}

const SERVER_SNAPSHOT: HouseholdSnapshot = {
  appliances: DEFAULT_APPLIANCES,
  isHydrated: false,
};

function readStorageSnapshot(): HouseholdSnapshot {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { appliances: DEFAULT_APPLIANCES, isHydrated: true };
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { appliances: parsed, isHydrated: true };
    }
    return { appliances: DEFAULT_APPLIANCES, isHydrated: true };
  } catch {
    return { appliances: DEFAULT_APPLIANCES, isHydrated: true };
  }
}

// Global cached client snapshot
let currentSnapshot: HouseholdSnapshot =
  typeof window !== "undefined" ? readStorageSnapshot() : SERVER_SNAPSHOT;

const listeners = new Set<() => void>();

function notify() {
  currentSnapshot = readStorageSnapshot();
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function persistAppliances(list: UserAppliance[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    notify();
  } catch (err) {
    console.error("Failed to persist household appliances:", err);
  }
}

export function useHouseholdStore() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => currentSnapshot,
    () => SERVER_SNAPSHOT,
  );

  const addAppliance = useCallback((item: UserAppliance) => {
    const next = [...currentSnapshot.appliances, item];
    persistAppliances(next);
  }, []);

  const updateAppliance = useCallback(
    (instanceId: string, updates: Partial<UserAppliance>) => {
      const next = currentSnapshot.appliances.map((a) =>
        a.instanceId === instanceId ? { ...a, ...updates } : a,
      );
      persistAppliances(next);
    },
    [],
  );

  const removeAppliance = useCallback((instanceId: string) => {
    const next = currentSnapshot.appliances.filter(
      (a) => a.instanceId !== instanceId,
    );
    persistAppliances(next);
  }, []);

  const duplicateAppliance = useCallback((instanceId: string) => {
    const target = currentSnapshot.appliances.find(
      (a) => a.instanceId === instanceId,
    );
    if (!target) return;
    const cloned: UserAppliance = {
      ...target,
      instanceId: generateApplianceId(`${target.catalogId || "app"}_copy`),
      name: `${target.name} (Copy)`,
    };
    const next = [...currentSnapshot.appliances, cloned];
    persistAppliances(next);
  }, []);

  const toggleAppliance = useCallback((instanceId: string) => {
    const next = currentSnapshot.appliances.map((a) =>
      a.instanceId === instanceId ? { ...a, enabled: !a.enabled } : a,
    );
    persistAppliances(next);
  }, []);

  const loadTemplate = useCallback((templateId: string) => {
    const tmpl = HOUSEHOLD_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    // Deep clone with fresh IDs to avoid collision
    const freshAppliances: UserAppliance[] = tmpl.appliances.map((a) => ({
      ...a,
      instanceId: generateApplianceId(a.catalogId || "tmpl"),
    }));
    persistAppliances(freshAppliances);
  }, []);

  const resetToDefault = useCallback(() => {
    loadTemplate("empty");
  }, [loadTemplate]);

  const clearAll = useCallback(() => {
    persistAppliances([]);
  }, []);

  return {
    appliances: snapshot.appliances,
    isHydrated: snapshot.isHydrated,
    addAppliance,
    updateAppliance,
    removeAppliance,
    duplicateAppliance,
    toggleAppliance,
    loadTemplate,
    resetToDefault,
    clearAll,
  };
}
