# Yu-Gi-Oh Reborn Format

A fan-made GitHub Pages site for the Reborn Format cube: a searchable card library
plus rules and drafting info. Built with plain HTML/CSS/JS and **Jekyll includes**
(no frameworks).

## Structure

```
_config.yml            Site config. baseurl MUST stay empty (apex custom domain).
CNAME                  yugioh-reborn.com

_layouts/
  default.html         Page skeleton: head + header + nav + content + footer.

_includes/
  head.html            <head> block (title, stylesheet).
  header.html          Title banner (Egyptian-stone texture lives in CSS).
  nav.html             Site navigation. Edit links here ONCE; every page updates.
  footer.html          Shared footer.
  search-panel.html    Search/sort/filter UI + card grid (card pages only).

index.html             Homepage hub (portal tiles).
monsters.html          Monster card pool (gold theme).
spells.html            Spell card pool (green theme).
traps.html             Trap card pool (purple theme).
rules.html             Embedded, read-only PDF of the ruleset.
draft.html             Placeholder so the Draft nav link doesn't 404.

cards.json             Card database. Each card now has a "category" field.
script.js              Page-aware: a page with #cardGrid reads its category from
                       <body data-category="..."> and shows only those cards.
style.css              Single stylesheet; theme switches via the --accent variable.

Images/                Backgrounds + per-category card art (Monsters/Spells/Traps).
Documents/             Reborn_Format_Rules.pdf
```

## How a page declares itself

Front matter on each page drives the shared layout:

```yaml
---
layout: default
nav: monsters        # which nav tab is highlighted
theme: monster       # monster | spell | trap | home  -> body theme class
category: Monster    # Monster | Spell | Trap  -> which cards/images load (omit on non-card pages)
title: "..."         # <title>
heading: "..."       # H1 in the header
tagline: "..."       # subtitle under the H1
---
```

## Notes / gotchas

- **baseurl stays empty.** The CNAME points at the apex domain `yugioh-reborn.com`,
  so links and images are root-relative. A non-empty baseurl would 404 everything.
- **Card images** are resolved from the card `name` (spaces -> `_`, `#` -> `No`,
  `&` -> `and`, `'` and `,` removed). GitHub Pages is case-sensitive, so a card
  name's capitalization must match its image filename.
- Spell/Trap pages render correctly but show "No cards found" until spell/trap
  entries (with `"category": "Spell"`/`"Trap"`) are added to `cards.json` and the
  matching art is placed in `Images/Spells/` and `Images/Traps/`.
