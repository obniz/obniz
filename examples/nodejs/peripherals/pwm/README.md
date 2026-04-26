# PWM

PWM出力の例。

| File | Description |
|------|-------------|
| [led-fade.ts](./led-fade.ts) | LEDの明るさをduty比でフェード |
| [servo.ts](./servo.ts) | 50Hz/1〜2msパルスでホビーサーボを駆動 (`obniz.wired("ServoMotor", ...)` を使わず生のPWMで動かす例) |

## Run

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node led-fade.ts
```
