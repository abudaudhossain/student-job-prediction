"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type PredictionModalContextValue = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const PredictionModalContext =
  createContext<PredictionModalContextValue | null>(null);

const HASH = "#prediction-form";

export function PredictionModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    void fetch("https://student-job-predition-server.onrender.com", { method: "GET" }).catch(() => {});
    setOpen(true);
    if (typeof window !== "undefined" && window.location.hash !== HASH) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${HASH}`,
      );
    }
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    if (typeof window !== "undefined" && window.location.hash === HASH) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      if (typeof window === "undefined") return;
      setOpen(window.location.hash === HASH);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const value = useMemo(
    () => ({ open, openModal, closeModal }),
    [open, openModal, closeModal],
  );

  return (
    <PredictionModalContext.Provider value={value}>
      {children}
    </PredictionModalContext.Provider>
  );
}

export function usePredictionModal() {
  const ctx = useContext(PredictionModalContext);
  if (!ctx) {
    throw new Error(
      "usePredictionModal must be used within PredictionModalProvider",
    );
  }
  return ctx;
}
