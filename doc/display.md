# Display
OLED display on obniz.

## display.clear();
clear the display.

```Javascript
// Example
obniz.display.clear();
```
## display.print(string);
print text on display.

```Javascript
// Example
obniz.display.print("Hello!");
```
## display.qr(data, correction)
show QR code with given text and correction level.
correction level can be choosed from

1. L
2. M(default)
3. Q
4. H

H is the strongest error correction.

```Javascript
// Example
obniz.display.qr("https://obniz.io")
```