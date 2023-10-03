export const countersByPrefix = {
} as Record<string, number | undefined>;

export function uniqueId(
  prefix = 'thing',
  existingIds: string[] = [],
  startAt = countersByPrefix[prefix] ?? 0
) {
  const id = startAt++
    ? `${prefix}-${startAt}`
    : prefix;

  if ( existingIds.includes(id) ) {
    return uniqueId(prefix, existingIds, startAt);
  }
  countersByPrefix[prefix] = startAt;
  return id;
};