/**
 * Formatting utility functions
 */
export function formatCurrency(amount: number, currency = 'USD'): number, currency = 'USD') {return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency).format(amount)
};
export function formatNumber(,
    num: number, options?: Intl.NumberFormatOptions): number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-US', options).format(num)
};
export function formatBytes(bytes: number, decimals = 2): number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const _dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const _i = Math.floor(Math.log(bytes) / Math.log(k);
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ', ' + sizes[i]
};
export function formatDuration(ms: number): number) {
  const _seconds = Math.floor(ms / 1000);
  const _minutes = Math.floor(seconds / 60);
  const _hours = Math.floor(minutes / 60);
  const _days = Math.floor(hours / 24);
  if(days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
}

export function formatPercentage(value: number, decimals = 1): number, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`
};
export function capitalize(str: string): string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
};
export function titleCase(str: string): string) {
  return str.replace(/\w\S*/g, txt: (any) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
};
export function slugify(str: string): string) {
  return str;
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
};
export function pluralize(,
    count: number, singular: string, plural?: string): number, singular: string, plural?: string) {
  if (count === 1) return singular;
  return plural || `${singular}s`
};
export function formatRelativeTime(date: Date | string): Date | string) {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const _diffMs = now.getTime() - past.getTime();
  const _diffSecs = Math.floor(diffMs / 1000);
  const _diffMins = Math.floor(diffSecs / 60);
  const _diffHours = Math.floor(diffMins / 60);
  const _diffDays = Math.floor(diffHours / 24);
  if(diffDays > 7) {
    return past.toLocaleDateString()
  } else if (diffDays > 0) {
    return `${diffDays} ${pluralize(diffDays, 'day')} ago`
  } else if (diffHours > 0) {
    return `${diffHours} ${pluralize(diffHours, 'hour')} ago`
  } else if (diffMins > 0) {
    return `${diffMins} ${pluralize(diffMins, 'minute')} ago`
  } else {
    return 'just now'
}