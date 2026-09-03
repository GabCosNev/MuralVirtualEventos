export const inputStyle =
  "rounded-md border border-black/20 bg-white/5 px-3 py-2 text-sm " +
  "hover:border-[var(--color-primary)] " +
  "focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors";

export const buttonRegisterLogin =
  "text-[var(--color-primary)] font-medium hover:underline cursor-pointer";

export const buttonEffectConfirm =
  "w-full bg-[var(--color-secondary)] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer";
export const paginationButton =
  "px-2 py-1 rounded-md text-sm text-white bg-[var(--color-dark)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors";

export const buttonModalConfirm =
  "bg-green-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";

export const buttonModalReturn =
  "bg-black/10 text-gray-900 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-black/20 transition-colors";

export const buttonModalDenied =
  "bg-red-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";

export function getAvatarColor(name: string) {
  const colors = ["#F472B6", "#4ADE80", "#FACC15", "#F87171", "#60A5FA"];
  const index = (name.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}
