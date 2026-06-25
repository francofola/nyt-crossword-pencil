# Privacy Policy — NYT Crossword Pencil Toggle

**Last updated: June 25, 2026**

## Overview

NYT Crossword Pencil Toggle ("the Extension") is a browser extension for Google Chrome that lets users toggle pencil mode in NYT Crossword puzzles using a configurable keyboard shortcut.

## Data Collection

**The Extension does not collect, transmit, or share any personal data.**

## Data Storage

The Extension uses Chrome's built-in `chrome.storage.sync` API exclusively to save your personally chosen settings:

- **Pencil-toggle mode** (shift-hold or hotkey)
- **Custom keyboard shortcut** (key and modifier keys)

This data:
- Is stored locally in your browser and optionally synced across your own devices via your Google account (standard Chrome sync behavior)
- Is never sent to or accessed by the extension developer or any third party
- Contains no personally identifiable information

## Permissions

| Permission | Purpose |
|---|---|
| `storage` | Save your shortcut and mode preferences across sessions |
| Host access to `nytimes.com/crosswords/*` and `nytimes.com/games/mini*` | Inject the content script that detects keyboard input and interacts with the puzzle's pencil toolbar button |

No other permissions are requested or used.

## Third Parties

The Extension does not integrate with any analytics, advertising, or third-party services.

## Changes to This Policy

If this policy changes, the updated version will be published in this repository. Continued use of the Extension after any change constitutes acceptance of the updated policy.

## Contact

For questions or concerns, open an issue at [https://github.com/francofola/nyt-crossword-pencil/issues](https://github.com/francofola/nyt-crossword-pencil/issues).
