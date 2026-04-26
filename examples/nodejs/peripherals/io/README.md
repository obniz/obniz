# IO (GPIO)

obniz の汎用デジタルIOを操作する例です。

| File | Description |
|------|-------------|
| [output.ts](./output.ts) | `io0` をHIGHに固定し、`io1` を1秒ごとにトグル |
| [input.ts](./input.ts) | `io0` を内部プルアップでスイッチ入力として監視 |
| [blink.ts](./blink.ts) | `io0`/`io1` 間に挿したLEDをチカチカさせる |

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node output.ts
```
