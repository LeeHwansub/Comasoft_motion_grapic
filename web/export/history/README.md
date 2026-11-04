# Export history (local only)

`out/` and dated folders under here are **not** committed.

```bash
cd web/export
node capture.mjs --page=v5 --webm=false
node snapshot.mjs --label=v5-check
```

Git tracks code only — not mp4/webm/png.
