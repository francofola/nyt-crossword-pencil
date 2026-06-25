(() => {
  'use strict';

  const DEFAULT_SHORTCUT = { key: 'p', modifiers: { alt: true, ctrl: false, shift: false } };

  const hotkeySection  = document.getElementById('hotkey-section');
  const shortcutKeysEl = document.getElementById('shortcut-keys');
  const recordingArea  = document.getElementById('recording-area');
  const changeBtn      = document.getElementById('change-btn');
  const cancelBtn      = document.getElementById('cancel-btn');
  const radios         = document.querySelectorAll('input[name="mode"]');

  let recording = false;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function renderShortcut(shortcut) {
    const parts = [];
    if (shortcut.modifiers.ctrl)  parts.push('Ctrl');
    if (shortcut.modifiers.alt)   parts.push('Alt');
    if (shortcut.modifiers.shift) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());

    shortcutKeysEl.innerHTML = parts
      .map((p, i) =>
        i < parts.length - 1
          ? `<kbd>${p}</kbd><span class="sep">+</span>`
          : `<kbd>${p}</kbd>`
      )
      .join('');
  }

  function setModeUI(mode) {
    hotkeySection.style.display = mode === 'hotkey' ? 'block' : 'none';
    radios.forEach((r) => { r.checked = r.value === mode; });
  }

  function startRecording() {
    recording = true;
    recordingArea.style.display = 'block';
    changeBtn.style.display     = 'none';
    cancelBtn.style.display     = 'block';
  }

  function stopRecording() {
    recording = false;
    recordingArea.style.display = 'none';
    changeBtn.style.display     = 'block';
    cancelBtn.style.display     = 'none';
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  chrome.storage.sync.get(['mode', 'shortcut'], (result) => {
    const mode     = result.mode     || 'shift';
    const shortcut = result.shortcut || DEFAULT_SHORTCUT;
    setModeUI(mode);
    renderShortcut(shortcut);
  });

  // ── Events ───────────────────────────────────────────────────────────────────

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const mode = radio.value;
      chrome.storage.sync.set({ mode });
      setModeUI(mode);
      stopRecording();
    });
  });

  changeBtn.addEventListener('click', startRecording);
  cancelBtn.addEventListener('click', stopRecording);

  document.addEventListener('keydown', (e) => {
    if (!recording) return;
    e.preventDefault();
    // Ignore bare modifier keypresses
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

    const shortcut = {
      key: e.key.toLowerCase(),
      modifiers: { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey },
    };

    chrome.storage.sync.set({ shortcut }, () => {
      renderShortcut(shortcut);
      stopRecording();
    });
  });
})();
