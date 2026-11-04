# Export history

`out/` is a scratch folder (gitignored). It gets overwritten on every capture.

Meaningful checkpoints go here so stills and videos stay in git with the code.

## Layout

```
history/
  YYYY-MM-DD-<label>/
    still-*.png
    comasoft-intro-*.mp4
    …
```

## Snapshot current `out/`

From `web/export/`:

```bash
node snapshot.mjs --label=v5-scene04
```

Creates `history/YYYY-MM-DD-<label>/` from the current `out/` contents.

Looktests for the v5 experiments live under `web/v5/review/` and are committed with that folder.
