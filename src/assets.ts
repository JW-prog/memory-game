/**
 * Resolve a public artwork filename relative to the configured Vite base path.
 *
 * @param file - Exact filename inside public/assets, including its extension.
 * @returns A URL with encoded spaces and literal equals signs for Vite compatibility.
 */
export function asset(file: string): string {
  // Vite's public-file middleware needs literal equals signs in these export names.
  const filename = encodeURIComponent(file).replace(/%3D/gi, '=');
  return `${import.meta.env.BASE_URL}assets/${filename}`;
}

