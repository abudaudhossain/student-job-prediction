"use client";

import { usePredictionModal } from "./prediction-modal-context";

const btnClass =
  "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:px-3 sm:text-sm";

export function NavbarPredictButton() {
  const { openModal } = usePredictionModal();
  return (
    <button type="button" onClick={openModal} className={btnClass}>
      Predict
    </button>
  );
}
