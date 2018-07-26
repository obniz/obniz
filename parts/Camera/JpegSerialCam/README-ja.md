# JpegSerialCam

撮影した画像をjpgにして、UARTで送信するカメラです。

![](./jpegcam.jpg)

<iframe width="560" height="315" src="https://www.youtube.com/embed/CYoMmMoa3ao" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

```Javascript
// Javascript Example
var cam = obniz.wired("JpegSerialCam", {vcc:0, cam_tx:1, cam_rx:2, gnd:3});
await cam.startwait({baud: 38400});
await cam.setResolusionWait("640*480");
var data = await cam.takewait();
```

## wire(obniz, {vcc, cam_tx, cam_rx, gnd})
電源とUARTを接続します。cam_txはカメラ側のtxと言う意味です。

```Javascript
var cam = obniz.wired("JpegSerialCam", {vcc:0, cam_tx:1, cam_rx:2, gnd:3});
```

## [await] startwait({[.baud]})
カメラを開始します。リセットが入るので2.5sほどかかります。

通信速度も指定できます。指定しない場合はカメラのデフォルトである38400となっています。

```Javascript
// Javascript Example
var cam = obniz.wired("JpegSerialCam", {vcc:0, cam_tx:1, cam_rx:2, gnd:3});
await cam.startwait({baud: 38400});
var data = await cam.takewait();
```

## [await] setResolusionWait(resolution)
解像度を指定します。
解像度は電源を消してもカメラ側に保存されます。

1. "640*480" (image size around 40kb)
2. "320*240" (image size around 12kb)
3. "160*120" (image size arond 4kb)

上記が利用できます。小さいほど早く撮影できますが粗いです。

```Javascript
// Javascript Example
var cam = obniz.wired("JpegSerialCam", {vcc:0, cam_tx:1, cam_rx:2, gnd:3});
await cam.startwait({baud: 38400});
await cam.setResolusionWait("640*480");
var data = await cam.takewait();
```

## [await] setBaudWait(baud)
カメラとの通信速度を決めます。早いほうが早く撮影できます。
この設定は電源を消してもカメラ側に保存されます。

1. 9600
2. 19200
3. 38400
4. 57600
5. 115200

上記が利用できます。
早いほうが良いですが、Wifiが遅い場合はデータを転送しきれないことがあります。

```Javascript
// Javascript Example
var cam = obniz.wired("JpegSerialCam", {vcc:0, cam_tx:1, cam_rx:2, gnd:3});
await cam.startwait({baud: 38400});
await cam.setBaudWait(115200);
await cam.takewait(); // baud is already changed to 115200.
```

## [await] takewait()
カメラで撮影し、jpegデータを取得します。

```Javascript
// Javascript Example
var cam = obniz.wired("JpegSerialCam", {vcc:0, cam_tx:1, cam_rx:2, gnd:3});
await cam.startwait({baud: 38400});
var imagedata = await cam.takewait();
```

## arrayToBase64(bytearray)
arrayデータをbase64にエンコードします。
これによりjpegのbase64データを取得できます。
htmlでは```<img>```タグにbase64のjpgを渡すと画像としてみることが出来ます。

```Javascript
// Javascript Example
var cam = obniz.wired("JpegSerialCam", {vcc:0, cam_tx:1, cam_rx:2, gnd:3});
await cam.startwait({baud: 38400});
const imagedata = await cam.takewait();
document.getElementById("ItemPreview").src = "data:image/png;base64," + cam.arrayToBase64(imagedata);
```