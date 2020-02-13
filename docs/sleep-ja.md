# Sleep
obniz Board 1Yのみで使用できるスリープ機能を紹介いたします。

スリープ機能とは、機能を停止して低消費電力モードとなることです。
起動とスリープを繰り返すことで長期間電池のみで稼働が可能になります。

[スリープ機能詳細](https://obniz.io/ja/doc/obniz_board_1y/hw_sleep)

スリープから復帰する条件を設定し、その条件に当てはまるときにobniz board 1Yがスリープから起動します。

スリープを使用するにあたって注意事項があります。

時間指定で起動する場合、個体や電源電圧、周囲の温度等により、最大±10％程度の誤差がある可能性があります。
注意してご使用ください。

## sleep(date)
obniz Board 1Yのみで動作します。

obniz BoardをDate型で指定された値だけスリープします。

最大45日間(64800分)スリープできます。

```Javascript
// Javascript Example
let dt = new Date();
dt.setHours(dt.getHours()+1,0,0,0);//毎時00分に指定
obniz.sleep(dt);
```
## sleepSeconds(sec)
obniz Board 1Yのみで動作します。

obniz Boardをsec(秒)で指定された値だけスリープします。

最大18時間（64800秒）スリープできます。

```Javascript
// Javascript Example
obniz.sleepSeconds(60);//60 sec
```
## sleepMinute(min)
obniz Board 1Yのみで動作します。

obniz Boardをmin(分)で指定された値だけスリープします。

最大45日間(64800分)スリープできます。

```Javascript
// Javascript Example
obniz.sleepMinute(60);//60 minute
```
## sleepIoTrigger(trigger)
obniz Board 1Yのみで動作します。

IO0のピン状態によってスリープから復帰します。

- true：立ち上がり （LOW -> HIGH）
- false:立ち下がり （HIGH -> LOW）

```Javascript
// Javascript Example
obniz.sleepIoTrigger(true);
```