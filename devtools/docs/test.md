# テスト

## ユニットテスト

Nodejs、ブラウザの2つの環境でユニットテストを行う。

```shell
npm run test
```

## 実機を利用した結合試験

対象となる製品を2つまたは3つ利用した結合試験。
obniz Board 2つの12のioとGNDを結合して試験を開始する

1つはobniz Board以外も選択できる。場合によっては3機種必要なことがある。

設定は環境変数から行う

- OBNIZ_ID: 1つめのobnizのid
- OBNIZ_DEVICE: OBNIZ_IDのデバイスの種類
- obnizA_ID: 2つの目のobniz Board の id
- obnizB_ID: (OBNIZ_DEVICEによって必要な場合のみ)3つの目のobniz Board の id
- DEBUG: 指定するとobniz.debugprintされる

`OBNIZ_DEVICE`選択肢

- devkitc
- stickc
- board
- board1y (default)
- lte
- pico

OBNIZ_ID, obnizA_ID, OBNIZB_IDにもデフォルト値が存在する。設定のロードプログラムは以下

[../../test/realtest/config.js](../../test/realtest/config.js) 

テスト実行方法

```shell
OBNIZ_DEVICE=board1y OBNIZ_ID=00000000 OBNIZA_ID=00000001 npm run realtest
```