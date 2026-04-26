# AD (Analog Input)

ADコンバータで電圧を読みます。

| File | Description |
|------|-------------|
| [read.ts](./read.ts) | `ad0` を変化検知でストリーミング、`ad1` をワンショット読み取り |

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node read.ts
```
