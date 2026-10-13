/**
 * Normalizes route links with Astro's configured BASE_URL (e.g. for GitHub Pages subpaths)
 */
export function getPath(path: string = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (!cleanPath) {
    return base;
  }

  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}
