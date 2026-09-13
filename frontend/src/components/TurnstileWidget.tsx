// components/TurnstileWidget.tsx
import { forwardRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface TurnstileWidgetProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onExpire: () => void;
}

export const TurnstileWidget = forwardRef<
  TurnstileInstance,
  TurnstileWidgetProps
>(function TurnstileWidget({ siteKey, onSuccess, onExpire }, ref) {
  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      onSuccess={onSuccess}
      onExpire={onExpire}
      options={{ size: "flexible" }}
    />
  );
});
