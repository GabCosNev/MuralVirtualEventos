import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface AvatarCropModalProps {
  imageSrc: string;
  isLoading: boolean;
  error: string;
  onConfirm: (area: Area) => void;
  onCancel: () => void;
}

export function AvatarCropModal({
  imageSrc,
  isLoading,
  error,
  onConfirm,
  onCancel,
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-title"
    >
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border-2 border-white overflow-hidden">
        {" "}
        <div className="bg-[var(--color-primary)] px-6 py-4">
          <h2 id="crop-title" className="text-white text-xl font-bold">
            Cortar imagem
          </h2>
        </div>
        <div className="px-6 py-4 flex flex-col gap-3">
          <div className="relative w-full h-56 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="crop-zoom" className="text-sm text-gray-600">
              Zoom
            </label>

            <input
              id="crop-zoom"
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-green-600 cursor-pointer"
            />
          </div>

          <p className="text-xs text-gray-500">
            Arraste para reposicionar. Salva como imagem 512×512.
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex justify-end gap-3 px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 text-sm font-medium rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => area && onConfirm(area)}
            disabled={isLoading || !area}
            className="bg-green-600 text-white text-sm font-medium rounded-lg px-4 py-2 cursor-pointer hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Enviando..." : "Aplicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
