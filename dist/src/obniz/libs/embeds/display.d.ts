/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import { ComponentAbstract } from '../ComponentAbstact';
/**
 * Here we will show letters and pictures on display on obniz Board.
 * ![](media://obniz_display_sphere.gif)
 *
 * @category Embeds
 */
export declare class Display extends ComponentAbstract {
    /**
     * display width size
     *
     * @readonly
     */
    readonly width: number;
    /**
     * display height size
     *
     * @readonly
     */
    readonly height: number;
    private autoFlush;
    private fontSize;
    private _canvas?;
    private _pos;
    private _colorDepthCapabilities;
    private _colorDepth;
    private _color;
    private _paper_white;
    private _raw_alternate;
    constructor(obniz: any, info: any);
    /**
     * This changes the font.
     * The options for fontFamily and fontSize depend on your browser.
     * If you are using node.js, node-canvas is required.
     *
     * The default font is Arial 16px.
     * If you set the parameter to null, you will be using the default font.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.font('Avenir',30)
     * obniz.display.print("Avenir")
     *
     * obniz.display.font(null,30) //default font(Arial) 30px
     * obniz.display.font('Avenir') //Avenir with default size(16px)
     * ```
     * ![](media://obniz_display_samples3.jpg)
     * ![](media://obniz_display_samples2.jpg)
     * ![](media://obniz_display_samples1.jpg)
     *
     * @param font font name
     * @param size size of font
     */
    font(font: string | null, size?: number): void;
    /**
     * Setting color for fill/stroke style for further rendering.
     * If you are using node.js, node-canvas is required.
     *
     * ```javascript
     * obniz.display.color('#FF0000');
     * obniz.display.rect(0, 0, 10, 10, false)
     * obniz.display.color('blue');
     * obniz.display.rect(0, 10, 10, 10, false)
     * ```
     *
     * @param color css acceptable color definition
     */
    setColor(color: string): void;
    /**
     * Getting color for fill/stroke style for further rendering.
     *
     * ```javascript
     * const current = obniz.display.getColor();
     * ```
     *
     */
    getColor(): string;
    /**
     * Clear the display.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.clear();
     * ```
     */
    clear(): void;
    /**
     * It changes the display position of a text. If you are using print() to display a text, position it to top left.
     *
     * If you are using node.js, node-canvas is required.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.pos(0,30);
     * obniz.display.print("YES. こんにちは");
     * ```
     * ![](media://obniz_display_pos.jpg)
     *
     * @param x
     * @param y
     */
    pos(x: number, y: number): {
        x: number;
        y: number;
    };
    /**
     * Print text on display.
     *
     * If you are using node.js and text is included characters out of ASCII code range, node-canvas is required.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.print("Hello!");
     * ```
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.font('Serif',18)
     * obniz.display.print("Hello World🧡")
     * ```
     * ![](media://obniz_display_print.jpg)
     *
     * @param text Text to display. With browser, UTF8 string is available.
     */
    print(text: string): void;
    /**
     * Draw a line between two points.
     * If you are using node.js, node-canvas is required.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.line(30, 30, 100, 30);
     * obniz.display.rect(20, 20, 20, 20);
     * obniz.display.circle(100, 30, 20);
     *
     * obniz.display.line(60, 50, 100, 30);
     * obniz.display.rect(50, 40, 20, 20, true);
     * obniz.display.line(50, 10, 100, 30);
     * obniz.display.circle(50, 10, 10, true);
     * ```
     *
     * ![](media://obniz_display_draws.jpg)
     *
     * @param x_0
     * @param y_0
     * @param x_1
     * @param y_1
     */
    line(x_0: number, y_0: number, x_1: number, y_1: number): void;
    /**
     * Draw a rectangle.
     * If you are using node.js, node-canvas is required.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.rect(10, 10, 20, 20);
     * obniz.display.rect(20, 20, 20, 20, true); // filled rect
     * ```
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @param mustFill
     */
    rect(x: number, y: number, width: number, height: number, mustFill?: boolean): void;
    /**
     * Draw a circle.
     * If you are using node.js, node-canvas is required.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.circle(40, 30, 20);
     * obniz.display.circle(90, 30, 20, true); // filled circle
     * ```
     *
     * @param x
     * @param y
     * @param r
     * @param mustFill
     */
    circle(x: number, y: number, r: number, mustFill?: boolean): void;
    /**
     * This shows QR code with given text and correction level.
     * The correction level can be
     *
     * - L
     * - M(default)
     * - Q
     * - H
     *
     * H is the strongest error correction.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.qr("https://obniz.io")
     * ```
     *
     * @param text
     * @param correction
     */
    qr(text: string, correction?: 'L' | 'M' | 'Q' | 'H'): void;
    /**
     * Draw BMP image
     *
     * ```javascript
     * obniz.display.raw([255, 255,,,,,])
     * ```
     *
     * You should care about colorDepth before sending raw datas.
     *
     * @param data data array.
     * The order is as below.
     * {1byte} {2byte} {3byte}...{16byte}
     * {17byte} {18byte} {19byte}...
     * .....
     * .....................
     */
    raw(data: number[]): void;
    /**
     * Setting color depth for all communication for the display
     * higher number will get more beautiful colors and lowest number 1 is just monochrome.
     * But 16 bit color mode is 16 times data bytes needed for same size rendering.
     *
     * ```javascript
     * obniz.display.setColorDepth(4); // => 4bit color mode.
     * ```
     *
     * @param depth monochrome display always 1. For color display 1(monochrome) and 4 and 16 can be selected.
     * default value is highest color depth for your display.
     * If you call just
     */
    setColorDepth(depth: number): void;
    /**
     * Getting color depth for all communication for the display
     *
     * ```javascript
     * const current = obniz.display.getColorDepth(); // => return current depth. 1 or higher
     * ```
     */
    getColorDepth(): number;
    /**
     * @ignore
     * @param io
     * @param moduleName
     * @param funcName
     */
    setPinName(io: number, moduleName: string, funcName: string): void;
    /**
     * @ignore
     * @param moduleName
     * @param data
     */
    setPinNames(moduleName: string, data: any): void;
    /**
     * Draw Display from HTML5 Canvas context.
     * With node-canvas, this works with node.js.
     *
     * - on HTML, load ctx from existing
     *
     * ```javascript
     * let ctx = $("#canvas")[0].getContext('2d');
     *
     * ctx.fillStyle = "white";
     * ctx.font = "30px Avenir";
     * ctx.fillText('Avenir', 0, 40);
     *
     * obniz.display.draw(ctx);
     * ```
     *
     * - on HTML, create new canvas dom and load it.
     *
     * ```javascript
     *
     * let ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);
     *
     * ctx.fillStyle = "white";
     * ctx.font = "30px Avenir";
     * ctx.fillText('Avenir', 0, 40);
     *
     * obniz.display.draw(ctx);
     * ```
     *
     * - running with node.js
     *
     * ```javascript
     * //    npm install canvas. ( version 2.0.0 or later required )
     * const { createCanvas } = require('canvas');
     * const canvas = createCanvas(128, 64);
     * const ctx = canvas.getContext('2d');
     *
     * ctx.fillStyle = "white";
     * ctx.font = "30px Avenir";
     * ctx.fillText('Avenir', 0, 40);
     *
     * obniz.display.draw(ctx);
     * ```
     *
     *
     * @param ctx
     */
    draw(ctx: CanvasRenderingContext2D): void;
    /**
     * You can specify to transfer the displayed data or not.
     * This affects only the functions that use canvas like clear/print/line/rect/circle/draw.
     * If you are using node.js, node-canvas is required.
     *
     * Use false to stop updating display and true to restart updating.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.drawing(false);
     * for (var i=0;i<100; i++) {
     *   var x0 = Math.random() * 128;
     *   var y0 = Math.random() * 64;
     *   var x1 = Math.random() * 128;
     *   var y1 = Math.random() * 64;
     *   obniz.display.clear();
     *   obniz.display.line(x0, y0, x1, y1);
     * }
     * obniz.display.drawing(true);
     * ```
     *
     * @param autoFlush
     */
    drawing(autoFlush: boolean): void;
    schemaBasePath(): string;
    protected _reset(): void;
    private warnCanvasAvailability;
    private _reset_canvas;
    private _preparedCanvas;
    private _ctx;
    private _draw;
}
