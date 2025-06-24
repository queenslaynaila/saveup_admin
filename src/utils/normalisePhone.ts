export const normalizePhoneNumber = (query: string): string => {
  const trimmed = query.trim();
  if (/^0\d{9}$/.test(trimmed)) {
    return '+254' + trimmed.slice(1);
  }
  return query;
};
