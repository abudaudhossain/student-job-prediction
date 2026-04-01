"use client";

import { usePredictionModal } from "./prediction-modal-context";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function OpenPredictionModalButton({ className, children }: Props) {
  const { openModal } = usePredictionModal();
  return (
    <button type="button" onClick={openModal} className={className}>
      {children}
    </button>
  );
}
