// Content is visible by default. Only a functioning observer opts individual items in.
export function initMotion(win, doc) {
  const root = doc.documentElement;
  const control = doc.querySelector('#motion-preference');
  const preference = win.matchMedia('(prefers-reduced-motion: reduce)');
  const items = [...doc.querySelectorAll('.reveal')];
  const completed = new Set();
  let observer;
  const show = item => {
    item.removeAttribute('data-reveal-pending');
    completed.add(item);
    observer?.unobserve(item);
  };
  // Reading the effective token preserves nearest-scope overrides, including a
  // nested System scope inside Full, rather than treating OS Reduce as a veto.
  const hasMotion = item => parseFloat(win.getComputedStyle(item).getPropertyValue('--c-motion-duration')) > 0;
  const refresh = () => {
    for (const item of items) {
      if (!hasMotion(item) || !observer) show(item);
      else if (!completed.has(item)) {
        observer.observe(item);
        item.setAttribute('data-reveal-pending', '');
      }
    }
  };
  try {
    if ('IntersectionObserver' in win) observer = new win.IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) show(entry.target);
    }, {threshold: 0.08});
    refresh();
  } catch {
    observer?.disconnect();
    observer = undefined;
    for (const item of items) show(item);
  }
  preference.addEventListener('change', refresh);
  if ('MutationObserver' in win) {
    new win.MutationObserver(refresh).observe(root, {
      subtree: true, attributes: true, attributeFilter: ['data-motion']
    });
  }
  control?.addEventListener('change', () => {
    if (!['system', 'reduce', 'full'].includes(control.value)) return;
    root.setAttribute('data-motion', control.value);
    refresh();
  });
  if (control) {
    control.value = root.getAttribute('data-motion') || 'system';
    control.closest('.motion-control').hidden = false;
  }
  doc.addEventListener('focusin', event => {
    const item = event.target.closest('.reveal');
    if (item) show(item);
  });
  const revealAnchor = () => {
    let id;
    try { id = decodeURIComponent(win.location.hash.slice(1)); } catch { return; }
    const target = doc.getElementById(id);
    if (!target) return;
    const parent = target.closest('.reveal');
    if (parent) show(parent);
    for (const item of target.querySelectorAll('.reveal')) show(item);
  };
  win.addEventListener('hashchange', revealAnchor);
  revealAnchor();
  return {refresh, show};
}
if (typeof window !== 'undefined' && typeof document !== 'undefined') initMotion(window, document);
