# Protocol TCP

Create a TCP connection.

8 TCP can be used.
tcp0 to tcp7 can be used.

## obniz.getFreeTcp()
Get TCP modules not used by obniz Board.
TCP can use 8 from tcp0 to tcp7,
You can get a TCP that is not in use by calling this function.

```Javascript
// Example
var tcp = obniz.getFreeTcp();
```

If no TCP is available, an exception is raised and the program stops.

```Javascript
// Example
var tcp0 = obniz.getFreeTcp();
var tcp1 = obniz.getFreeTcp();
var tcp2 = obniz.getFreeTcp();
var tcp3 = obniz.getFreeTcp();
var tcp4 = obniz.getFreeTcp();
var tcp5 = obniz.getFreeTcp();
var tcp6 = obniz.getFreeTcp();
var tcp7 = obniz.getFreeTcp();
var tcp8 = obniz.getFreeTcp(); // Error
```

## connectWait(port, domain)

Starts a connection on the port and domain for which TCP is specified.。

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");
```

## write(data)

The argument data is sent by TCP.

If you pass a string or Array type argument, the data will be sent.

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

// Array
tcp.write([0,1,2,3,4]);

// Text
tcp.write('hello');
```

## readWait

Wait for TCP reception.

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

let data = await tcp.readWait();
console.log(data);
```

## onreceive

Callback function is called when TCP is received.

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

tcp.onreceive = data => {
    console.log(data);
};
```

## onconnection

Callback function is called when there is a change in TCP connection status.

- true : Connect
- false : Disconnect

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();

tcp.onconnection = data => {
    console.log(data);
};
tcp.connectWait(80,"obniz.io");
```

## onerror

You can get the error message that occurred when connecting.

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

tcp.onerror = state => {
    console.log(state);
};
```

## end();

Terminates the TCP session.

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.end();
```