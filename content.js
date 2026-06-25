(() => {
  'use strict';

  const DEFAULT_SHORTCUT = { key: 'p', modifiers: { alt: true, ctrl: false, shift: false } };
  // 'shift' = hold-shift mode | 'hotkey' = toggle with a key combo
  let mode = 'shift';
  let shortcut = DEFAULT_SHORTCUT;
  // True when *we* activated pencil on Shift down in shift mode
  let shiftActivatedPencil = false;

  // Load settings
  chrome.storage.sync.get(['mode', 'shortcut'], (result) => {
    if (result.mode)     mode     = result.mode;
    if (result.shortcut) shortcut = result.shortcut;
  });

  // React to settings changes from popup (no page reload needed)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.mode)     mode     = changes.mode.newValue;
    if (changes.shortcut) shortcut = changes.shortcut.newValue;
  });

  function findPencilButton() {
    // Primary — matches both inactive and active icon class
    const icon = document.querySelector(
      'i.xwd__toolbar_icon--pencil, i.xwd__toolbar_icon--pencil-active'
    );
    if (icon) return icon.closest('button');

    // aria-label fallbacks
    const ariaSelectors = [
      'button[aria-label="Pencil"]',
      'button[aria-label="Enter Pencil mode"]',
      'button[aria-label="Pencil Mode"]',
      '[aria-label*="pencil" i]',
    ];
    for (const selector of ariaSelectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }

    // Last resort: scan all buttons for pencil-related text
    for (const btn of document.querySelectorAll('button')) {
      const label = (btn.getAttribute('aria-label') || '').toLowerCase();
      const title = (btn.title || '').toLowerCase();
      if (label.includes('pencil') || title.includes('pencil')) return btn;
    }

    return null;
  }

  function isPencilActive(btn) {
    return (
      !!btn.querySelector('i.xwd__toolbar_icon--pencil-active') ||
      !!btn.closest('li')?.classList.contains('xwd__tool--button--active')
    );
  }

  /** Show a brief overlay toast. */
  function showToast(message) {
    const existing = document.getElementById('ptt-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'ptt-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position:      'fixed',
      bottom:        '28px',
      left:          '50%',
      transform:     'translateX(-50%)',
      background:    'rgba(0, 0, 0, 0.78)',
      color:         '#fff',
      padding:       '8px 22px',
      borderRadius:  '20px',
      fontFamily:    'Georgia, serif',
      fontSize:      '14px',
      zIndex:        '2147483647',
      pointerEvents: 'none',
      opacity:       '1',
      transition:    'opacity 0.3s ease',
    });

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, 1300);
  }

  // ── Shift-hold mode ──────────────────────────────────────────────────────────

  // Shift down → activate pencil (only if it isn't already on)
  document.addEventListener('keydown', (e) => {
    if (mode !== 'shift' || e.key !== 'Shift' || e.repeat) return;
    const btn = findPencilButton();
    if (!btn || isPencilActive(btn)) return;
    btn.click();
    shiftActivatedPencil = true;
    showToast('✏️ Pencil ON');
  }, true);

  // Shift up → deactivate pencil (only if we turned it on)
  document.addEventListener('keyup', (e) => {
    if (mode !== 'shift' || e.key !== 'Shift' || !shiftActivatedPencil) return;
    shiftActivatedPencil = false;
    const btn = findPencilButton();
    if (!btn) return;
    if (isPencilActive(btn)) {
      btn.click();
      showToast('✏️ Pencil OFF');
    }
  }, true);

  // Safety: if the page loses focus while Shift is held, reset
  window.addEventListener('blur', () => {
    if (!shiftActivatedPencil) return;
    shiftActivatedPencil = false;
    const btn = findPencilButton();
    if (btn && isPencilActive(btn)) btn.click();
  });

  // ── Hotkey-toggle mode ───────────────────────────────────────────────────────

  document.addEventListener('keydown', (e) => {
    if (mode !== 'hotkey') return;
    if (e.key.toLowerCase() !== shortcut.key.toLowerCase()) return;
    if (!!e.altKey   !== !!shortcut.modifiers.alt)   return;
    if (!!e.ctrlKey  !== !!shortcut.modifiers.ctrl)  return;
    if (!!e.shiftKey !== !!shortcut.modifiers.shift) return;
    e.preventDefault();
    e.stopPropagation();
    const btn = findPencilButton();
    if (!btn) { showToast('✏️ Pencil button not found – try refreshing'); return; }
    const active = isPencilActive(btn);
    btn.click();
    showToast(active ? '✏️ Pencil OFF' : '✏️ Pencil ON');
  }, true);

})();
