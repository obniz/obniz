# 7SegmentLED_MAX7219
MAX7219に接続された7セグメントLEDを制御するクラスです。
MAX7219一つにつき最大8桁の7セグメントLEDを制御することができます。
接続できる7セグメントLEDはカソードコモンタイプです。
MAX7219を連続してつなげ、8桁以上のディスプレイを作ることもできます。

## wired(obniz,  { clk, cs, din, gnd, vcc});

clk: SPIのCLKピンです。MAX7219のCLKピンへ接続してください。
cs: チップ選択です。MAX7219のLOAD(CK)ピンへ接続してください。
din: SPIの MOSI ピンです。MAX7219のDINピンへ接続してください。
gnd: 電源のマイナスです。
vcc: 電源のプラスです。

DIPタイプのMAX7219であれば、以下のような接続になります。
![](./obniz-max7219_single.png)

チェーン状につなぐ場合は最初の1つをObnizにつなぎ、2つ目以降はDINを前のDOUTにつないでください。
obniz-DIN[1つ目のディスプレイ]DOUT-DIN[2つ目のディスプレイ]DOUT-~
![](./obniz-max7219_multi.png)

7セグメントLEDとMAX7219は以下のように接続します。
|MAX7219<br>ピン名(ピン番号)|7セグメントLED|
|:--:|:--:|
|SEG A(14)|A|
|SEG B(16)|B|
|SEG C(20)|C|
|SEG D(23)|D|
|SEG E(21)|E|
|SEG F(15)|F|
|SEG G(17)|G|
|SEG DP(22)|DP|
|DIG 0(2)|COM0|
|DIG 1(11)|COM1|
|DIG 2(6)|COM2|
|DIG 3(7)|COM3|
|DIG 4(3)|COM4|
|DIG 5(10)|COM5|
|DIG 6(5)|COM6|
|DIG 7(8)|COM7|

*補足
  *7セグメントLEDのピン番号は製品によって異なるので、データシートで確認してください。
  *7セグメントLEDはA~DPはANODE,COM0~COM7はCATHODEと併記されている場合があります。
  *DIGは桁なので、1桁の7セグメントLEDを接続した場合はDIG 0のみを使い、DIG 1以降は使いません。
  *DPはドット用です。ドットの無い7セグメントLEDの場合は接続しません。


```Javascript
// Javascript Example
const segment = obniz.wired("7SegmentLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
```

## init(numberOfDisplays, digits)

7セグメントLEDを初期化します。
numberOfDisplaysにディスプレイの個数(すなわちMAX7219の個数)、
digitsにディスプレイ一つあたりの7セグメントLEDの桁数を指定します。
4桁表示のディスプレイを1つ繋いだ場合はinit(1,4)となります。

```Javascript
// Javascript Example
const segment = obniz.wired("7SegmentLED_MAX7219",  { clk:0, cs:1, din:2, gnd:3, vcc:4});
segment.init(1, 4);
```

## brightness(display,value)
特定のディスプレイの明るさを変更します。
displayでディスプレイ番号を指定し(0から始まります)、
valueに0~15の範囲で明るさを指定します。

## brightnessAll(value)
接続されているすべてのディスプレイの明るさを変更します。
valueに0~15の範囲で明るさを指定します。

## setNumber(display,digit,number,dp)
7セグメントLEDを任意の数字に点灯します。
display : 表示するディスプレイ番号を指定(0から始まります)
digit : 表示する桁を指定します。(0から始まります)
number :
表示する数字を0~9で指定します。次の文字も指定できます:-(ハイフン),E,H,L,P
何も指定しないか、offを指定すると消灯します。
dp : ドット表示がある7セグメントLEDのドットの点灯/消灯を指定します。(点灯:true,消灯:false)


```Javascript
// Javascript Example
const segment = obniz.wired("7SegmentLED_MAX7219",  { clk:0, cs:1, din:2, gnd:3, vcc:4});
segment.init(1, 4); // 4桁のディスプレイを一つ接続
segment.setNumber(0,0,5,false); // ディスプレイ0の1桁目に5を表示,ドット消灯
segment.setNumber(0,1,"e",false); // ディスプレイ0の2桁目にEを表示,ドット消灯
segment.setNumber(0,2,"off",true); // ディスプレイ0の3桁目を消灯,ドットは点灯
```

## clear(display)
displayで指定したディスプレイの表示内容を消去します。

## clearall()
接続されているすべてのディスプレイの表示内容を消去します。

## test()
MAX7219のテストコマンドを実行します。
