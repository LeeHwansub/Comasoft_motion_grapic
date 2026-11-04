# Export history (local only)

`out/` and dated snapshot folders under here are **not** committed.
Run capture locally, then snapshot if you want a local backup:

```bash
cd web/export
node capture.mjs
node snapshot.mjs --label=v5-scene04
```

Git tracks code (`web/`, `web/v5/`) and this README only — not mp4/webm/png outputs.
