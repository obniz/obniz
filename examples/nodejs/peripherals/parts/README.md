# Wired Parts

`obniz.wired(...)` でPartsライブラリのコンポーネントを駆動する例。

| File | Part |
|------|------|
| [led.ts](./led.ts) | `LED` を点滅 |
| [button.ts](./button.ts) | タクトスイッチの押下を検知 |
| [servo.ts](./servo.ts) | `ServoMotor` を角度指定で動かす |
| [distance-hcsr04.ts](./distance-hcsr04.ts) | `HC-SR04` 超音波距離センサ |
| [temperature-lm35dz.ts](./temperature-lm35dz.ts) | `LM35DZ` 温度センサ |

部品の配線図は [Parts Library](https://obniz.com/sdk/parts/) を参照してください。

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node led.ts
```
