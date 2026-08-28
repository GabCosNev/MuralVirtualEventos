import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { verifyEmail } from "../../services/auth.service";
import { type VerifyStatus } from "../../types/auth.types";

export function useVerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyStatus>(
    token ? "loading" : "invalid",
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        toast.success("E-mail verificado! Faça login para continuar.");
        navigate("/login", { replace: true });
      } catch (e: unknown) {
        const err = e as { response?: { data?: { errorCode?: string } } };
        const errorCode = err.response?.data?.errorCode;

        setStatus(errorCode === "TOKEN_EXPIRED" ? "expired" : "invalid");
      }
    };

    void verify();
  }, [token, navigate]);

  return { status };
}
