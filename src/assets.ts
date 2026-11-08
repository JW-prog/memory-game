export function asset(file: string): string {
  // Vite's public-file middleware needs literal equals signs in these export names.
  const filename = encodeURIComponent(file).replace(/%3D/gi, '=');
  return `${import.meta.env.BASE_URL}assets/${filename}`;
}

