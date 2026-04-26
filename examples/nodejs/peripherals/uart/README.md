# UART

シリアル通信の例。

| File | Description |
|------|-------------|
| [echo.ts](./echo.ts) | 受信は `onreceive` でテキスト/バイト両方取得、2秒毎に送信 |

配線: `tx` → io0, `rx` → io1。相手側の TX/RX とクロスして接続してください。

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node echo.ts
```
