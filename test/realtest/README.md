# 実機テスト

obnizAとobnizBを使った実機テストを行う。

```
npm run realtest
```
で実行される。

```
DEBUG=true npm run realtest
```
で通信ログが出る。

設定可能な環境変数(see test/realtest/config.js)

| key           | Default     | value                              |
|---------------|-------------|------------------------------------|
| DEBUG         | `undefined` | true for logout                    |
| LOCAL_CONNECT | `true`      | false for do not use local connect |
| OBNIZ_ID      |             | obnizID for checkboard             |
| OBNIZ_DEVICE  | `board1y`   | hardware for test target           |
| OBNIZA_ID     |             | obnizID for test target            |
| PORT          | 3001        | TCP port                           |
