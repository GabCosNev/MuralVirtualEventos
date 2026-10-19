import { Loader2 } from "lucide-react";
import { PasswordInput } from "../components/PasswordInput";

interface DeleteAccountViewProps {
  password: string;
  onPasswordChange: (value: string) => void;
  error: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAccountView({
  password,
  onPasswordChange,
  error,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteAccountViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border-2 border-white">
        <div className="bg-red-600 px-6 py-4 rounded-tl-xl rounded-tr-xl">
          <h1 className="text-white text-xl font-bold">Excluir conta</h1>
        </div>

        <div className="px-6 py-8 flex flex-col gap-5">
          <p className="text-sm text-gray-700">
            Esta ação é <strong>permanente</strong>. Sua conta e todas as
            postagens que você criou serão apagadas e não poderão ser
            recuperadas.
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Digite sua senha para confirmar
            </label>

            <PasswordInput
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 font-semibold cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold cursor-pointer hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
              {isLoading ? "Excluindo..." : "Excluir permanentemente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
