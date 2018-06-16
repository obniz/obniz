# 7SegmentLED_MAX7219
MAX7219に接続された7セグメントLEDを制御するクラスです。
MAX7219一つにつき最大8桁の7セグメントLEDを制御することができます。
また、連続してつなげることができるのも特徴です。


## wired(obniz,  { clk, cs, din, gnd, vcc});

clk: SPIのCLKピンです。MAX7219のCLKピンへ接続してください。
cs: チップ選択です。MAX7219のLOAD(CK)ピンへ接続してください。
din: SPIの MOSI ピンです。MAX7219のDINピンへ接続してください。
gnd: 電源のマイナスです。
vcc: 電源のプラスです。

DIPタイプのMAX7219であれば、以下のような接続になります。
<画像>
一例として、下記のページで販売されている4桁7セグメントLEDの接続例を示します。
http://akizukidenshi.com/catalog/goods/search.aspx?keyword=&maker=&goods=i&number=osl40391&name=%83J%83%5C%81%5B%83h&min_price=&max_price=&last_sdt=&sort=&style=T&search.x=0&search.y=0
<画像>

チェーン状につなぐ場合は最初の1つをObnizにつなぎ、2つ目以降はDINを前のDOUTにつないでください。
obniz-DIN[1つ目のディスプレイ]DOUT-DIN[2つ目のディスプレイ]DOUT-~
<画像>

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
