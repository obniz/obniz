# SPI

SPIマスタの汎用例。

| File | Description |
|------|-------------|
| [master.ts](./master.ts) | 4byte送信しながら同じ長さを受信 (例: SPI Flashの`0x9F` JEDEC ID読み出し) |

配線: `clk` → io0, `mosi` → io1, `miso` → io2。CSはターゲットに合わせて任意のIOで制御してください。

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node master.ts
```
