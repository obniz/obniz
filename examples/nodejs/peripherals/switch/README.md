# Onboard Switch

obniz Board上のスライドスイッチを監視します。

| File | Description |
|------|-------------|
| [monitor.ts](./monitor.ts) | 状態変化を購読、`stateWait` で一回だけ待つ |

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node monitor.ts
```
