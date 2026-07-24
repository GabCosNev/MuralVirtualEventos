import { useState } from "react";

export function useRejectForm() {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function validate(): boolean {
    if (reason.trim().length < 10) {
      setError("O motivo da rejeição deve ter no mínimo 10 caracteres.");
      return false;
    }

    setError("");
    return true;
  }

  function resetForm() {
    setReason("");
    setError("");
  }

  return { reason, setReason, error, validate, resetForm };
}
