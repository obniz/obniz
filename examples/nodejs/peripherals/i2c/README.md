# I2C

I2Cマスタの汎用例。

| File | Description |
|------|-------------|
| [master.ts](./master.ts) | レジスタ書き込み→読み出し (例: 0x50 のEEPROM) |
| [scan.ts](./scan.ts) | バス上のスレーブアドレスをスキャン |

配線: `sda` → io2, `scl` → io3 (内部プルアップ5V使用)。
プルアップ抵抗を外付けする場合は `pull` を外してください。

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node master.ts
```
