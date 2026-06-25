# NYT Crossword Pencil Toggle

A Chrome extension that lets you toggle pencil mode in the NYT Crossword (daily and Mini) with a keyboard shortcut.

**Default shortcut:** `Alt + P`

---

## Loading the extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select this folder (`CrosswordPencilToggle`)
5. The extension is now active

---

## Usage

- Open any NYT crossword at `nytimes.com/crosswords` or the Mini crossword
- Press **Alt + P** to toggle pencil mode on/off
- A brief toast notification confirms the state change

## Changing the shortcut

Click the extension icon in the Chrome toolbar to open the popup, then click **Change Shortcut** and press any key combination you prefer (e.g. `Ctrl+Shift+P`).

---

## How it works

The content script runs on NYT crossword pages and listens for the configured key combination in the **capture phase**, so it intercepts the keydown before the crossword game sees it. It locates the pencil toolbar button via `aria-label` selectors and programmatically clicks it.

## Notes

- If the pencil button is ever not found (NYT may update their DOM), open DevTools on the crossword page, inspect the pencil toolbar button, and note its `aria-label` value — update the `selectors` array in `content.js` accordingly.
- No data is collected. The only permission used is `storage` (to persist your shortcut preference locally).
