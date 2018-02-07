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


## display.raw([0,1,2,,,,]);

1 bit represents 1 dot. 1=white, 0=black.
1 byte is part of one line.
Order is same like.  
{0byte} {1byte} {2byte}  
{3byte} {4byte} {5byte}...  

```javascript
obniz.display.raw([255, 255,,,,,])// msut be 128*64 bytes
```