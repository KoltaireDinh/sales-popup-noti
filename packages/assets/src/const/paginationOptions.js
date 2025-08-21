import isLocal from '@assets/helpers/isLocal';

export const commonItemPages = [isLocal && 2, 10, 20, 50, 100].filter(Boolean).map(x => ({
  label: `${x}`,
  value: `${x}`
}));
