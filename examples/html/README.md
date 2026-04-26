# HTML Examples

ブラウザから直接 obniz を操作するシンプルな例です。各ファイルは単独で動きます — ローカルで開くか、適当なHTTPサーバで配信してください。

| File | What it does |
|------|--------------|
| [01-hello-world.html](./01-hello-world.html) | obnizに接続し、テキストボックスの内容をディスプレイに表示 |
| [02-led-button.html](./02-led-button.html) | 画面ボタンでLEDをON/OFF/Blink |
| [03-servo-slider.html](./03-servo-slider.html) | スライダーでサーボの角度をリアルタイムに制御 |
| [04-onboard-switch.html](./04-onboard-switch.html) | obniz Boardのスライドスイッチの状態を画面に反映 |
| [05-temperature-monitor.html](./05-temperature-monitor.html) | LM35DZの温度を1秒ごとにサンプリングして折れ線グラフで表示 |

## Run

任意のWebサーバから配信してブラウザで開いてください。例:

```bash
npx http-server examples/html
# → http://127.0.0.1:8080/01-hello-world.html
```

## Note: アクセストークンの扱い

これらのサンプルは画面のフォームから obniz ID を受け取る形にしてあります。
**アクセストークンや有償アカウントのキーをHTMLに直書きしないでください** — クライアントサイドに置いた瞬間に第三者から閲覧可能になります。本番ではトークンが必要な操作はサーバサイド (`nodejs/` のサンプル) から行ってください。
