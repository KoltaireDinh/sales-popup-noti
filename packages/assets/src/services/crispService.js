/**
 * Get support action
 */
export function getRawSupport(text = `Hi,\nPlease help us to `) {
  if (!window.$crisp) return;
  window.$crisp.push(['do', 'chat:open']);
  window.$crisp.push(['set', 'message:text', text]);
}
