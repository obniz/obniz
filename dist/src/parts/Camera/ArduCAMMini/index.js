"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ArduCAMMini {
    constructor() {
        this.keys = [
            "cs",
            "mosi",
            "miso",
            "sclk",
            "gnd",
            "vcc",
            "sda",
            "scl",
            "spi",
            "i2c",
            "spi_frequency",
            "spi_drive",
            "module_version",
        ];
        this.requiredKeys = ["cs"];
        this.ioKeys = this.keys;
        this.displayName = "Cam";
        this.regs = {
            ARDUCHIP_TEST1: 0x00,
            ARDUCHIP_MODE: 0x02,
            ARDUCHIP_FIFO: 0x04,
            BURST_FIFO_READ: 0x3c,
            ARDUCHIP_TRIG: 0x41,
            FIFO_SIZE1: 0x42,
            FIFO_SIZE2: 0x43,
            FIFO_SIZE3: 0x44,
        };
        this.configs = {
            OV2640_JPEG_INIT: [
                [0xff, 0x00],
                [0x2c, 0xff],
                [0x2e, 0xdf],
                [0xff, 0x01],
                [0x3c, 0x32],
                [0x11, 0x04],
                [0x09, 0x02],
                [0x04, 0x28],
                [0x13, 0xe5],
                [0x14, 0x48],
                [0x2c, 0x0c],
                [0x33, 0x78],
                [0x3a, 0x33],
                [0x3b, 0xfb],
                [0x3e, 0x00],
                [0x43, 0x11],
                [0x16, 0x10],
                [0x39, 0x92],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0x48, 0x00],
                [0x5b, 0x00],
                [0x42, 0x03],
                [0x4a, 0x81],
                [0x21, 0x99],
                [0x24, 0x40],
                [0x25, 0x38],
                [0x26, 0x82],
                [0x5c, 0x00],
                [0x63, 0x00],
                [0x61, 0x70],
                [0x62, 0x80],
                [0x7c, 0x05],
                [0x20, 0x80],
                [0x28, 0x30],
                [0x6c, 0x00],
                [0x6d, 0x80],
                [0x6e, 0x00],
                [0x70, 0x02],
                [0x71, 0x94],
                [0x73, 0xc1],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x37, 0xc0],
                [0x4f, 0x60],
                [0x50, 0xa8],
                [0x6d, 0x00],
                [0x3d, 0x38],
                [0x46, 0x3f],
                [0x4f, 0x60],
                [0x0c, 0x3c],
                [0xff, 0x00],
                [0xe5, 0x7f],
                [0xf9, 0xc0],
                [0x41, 0x24],
                [0xe0, 0x14],
                [0x76, 0xff],
                [0x33, 0xa0],
                [0x42, 0x20],
                [0x43, 0x18],
                [0x4c, 0x00],
                [0x87, 0xd5],
                [0x88, 0x3f],
                [0xd7, 0x03],
                [0xd9, 0x10],
                [0xd3, 0x82],
                [0xc8, 0x08],
                [0xc9, 0x80],
                [0x7c, 0x00],
                [0x7d, 0x00],
                [0x7c, 0x03],
                [0x7d, 0x48],
                [0x7d, 0x48],
                [0x7c, 0x08],
                [0x7d, 0x20],
                [0x7d, 0x10],
                [0x7d, 0x0e],
                [0x90, 0x00],
                [0x91, 0x0e],
                [0x91, 0x1a],
                [0x91, 0x31],
                [0x91, 0x5a],
                [0x91, 0x69],
                [0x91, 0x75],
                [0x91, 0x7e],
                [0x91, 0x88],
                [0x91, 0x8f],
                [0x91, 0x96],
                [0x91, 0xa3],
                [0x91, 0xaf],
                [0x91, 0xc4],
                [0x91, 0xd7],
                [0x91, 0xe8],
                [0x91, 0x20],
                [0x92, 0x00],
                [0x93, 0x06],
                [0x93, 0xe3],
                [0x93, 0x05],
                [0x93, 0x05],
                [0x93, 0x00],
                [0x93, 0x04],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x93, 0x00],
                [0x96, 0x00],
                [0x97, 0x08],
                [0x97, 0x19],
                [0x97, 0x02],
                [0x97, 0x0c],
                [0x97, 0x24],
                [0x97, 0x30],
                [0x97, 0x28],
                [0x97, 0x26],
                [0x97, 0x02],
                [0x97, 0x98],
                [0x97, 0x80],
                [0x97, 0x00],
                [0x97, 0x00],
                [0xc3, 0xed],
                [0xa4, 0x00],
                [0xa8, 0x00],
                [0xc5, 0x11],
                [0xc6, 0x51],
                [0xbf, 0x80],
                [0xc7, 0x10],
                [0xb6, 0x66],
                [0xb8, 0xa5],
                [0xb7, 0x64],
                [0xb9, 0x7c],
                [0xb3, 0xaf],
                [0xb4, 0x97],
                [0xb5, 0xff],
                [0xb0, 0xc5],
                [0xb1, 0x94],
                [0xb2, 0x0f],
                [0xc4, 0x5c],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x8c, 0x00],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x5a, 0xc8],
                [0x5b, 0x96],
                [0x5c, 0x00],
                [0xd3, 0x00],
                [0xc3, 0xed],
                [0x7f, 0x00],
                [0xda, 0x00],
                [0xe5, 0x1f],
                [0xe1, 0x67],
                [0xe0, 0x00],
                [0xdd, 0x7f],
                [0x05, 0x00],
                //
                [0x12, 0x40],
                [0xd3, 0x04],
                [0xc0, 0x16],
                [0xc1, 0x12],
                [0x8c, 0x00],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x2c],
                [0x52, 0x24],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x5a, 0x2c],
                [0x5b, 0x24],
                [0x5c, 0x00],
                [0xff, 0xff],
            ],
            OV2640_YUV422: [
                [0xff, 0x00],
                [0x05, 0x00],
                [0xda, 0x10],
                [0xd7, 0x03],
                [0xdf, 0x00],
                [0x33, 0x80],
                [0x3c, 0x40],
                [0xe1, 0x77],
                [0x00, 0x00],
                [0xff, 0xff],
            ],
            OV2640_JPEG: [
                [0xe0, 0x14],
                [0xe1, 0x77],
                [0xe5, 0x1f],
                [0xd7, 0x03],
                [0xda, 0x10],
                [0xe0, 0x00],
                [0xff, 0x01],
                [0x04, 0x08],
                [0xff, 0xff],
            ],
            OV2640_160x120_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x92],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x28],
                [0x5b, 0x1e],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_176x144_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x92],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x2c],
                [0x5b, 0x24],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_320x240_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x89],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x50],
                [0x5b, 0x3c],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_352x288_JPEG: [
                [0xff, 0x01],
                [0x12, 0x40],
                [0x17, 0x11],
                [0x18, 0x43],
                [0x19, 0x00],
                [0x1a, 0x4b],
                [0x32, 0x09],
                [0x4f, 0xca],
                [0x50, 0xa8],
                [0x5a, 0x23],
                [0x6d, 0x00],
                [0x39, 0x12],
                [0x35, 0xda],
                [0x22, 0x1a],
                [0x37, 0xc3],
                [0x23, 0x00],
                [0x34, 0xc0],
                [0x36, 0x1a],
                [0x06, 0x88],
                [0x07, 0xc0],
                [0x0d, 0x87],
                [0x0e, 0x41],
                [0x4c, 0x00],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0x64],
                [0xc1, 0x4b],
                [0x86, 0x35],
                [0x50, 0x89],
                [0x51, 0xc8],
                [0x52, 0x96],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x00],
                [0x57, 0x00],
                [0x5a, 0x58],
                [0x5b, 0x48],
                [0x5c, 0x00],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_640x480_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x3d],
                [0x50, 0x89],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0xa0],
                [0x5b, 0x78],
                [0x5c, 0x00],
                [0xd3, 0x04],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_800x600_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x35],
                [0x50, 0x89],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0xc8],
                [0x5b, 0x96],
                [0x5c, 0x00],
                [0xd3, 0x02],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_1024x768_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x8c, 0x00],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x5a, 0x00],
                [0x5b, 0xc0],
                [0x5c, 0x01],
                [0xd3, 0x02],
                [0xff, 0xff],
            ],
            OV2640_1280x960_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0x40],
                [0x5b, 0xf0],
                [0x5c, 0x01],
                [0xd3, 0x02],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
            OV2640_1600x1200_JPEG: [
                [0xff, 0x01],
                [0x11, 0x01],
                [0x12, 0x00],
                [0x17, 0x11],
                [0x18, 0x75],
                [0x32, 0x36],
                [0x19, 0x01],
                [0x1a, 0x97],
                [0x03, 0x0f],
                [0x37, 0x40],
                [0x4f, 0xbb],
                [0x50, 0x9c],
                [0x5a, 0x57],
                [0x6d, 0x80],
                [0x3d, 0x34],
                [0x39, 0x02],
                [0x35, 0x88],
                [0x22, 0x0a],
                [0x37, 0x40],
                [0x34, 0xa0],
                [0x06, 0x02],
                [0x0d, 0xb7],
                [0x0e, 0x01],
                [0xff, 0x00],
                [0xe0, 0x04],
                [0xc0, 0xc8],
                [0xc1, 0x96],
                [0x86, 0x3d],
                [0x50, 0x00],
                [0x51, 0x90],
                [0x52, 0x2c],
                [0x53, 0x00],
                [0x54, 0x00],
                [0x55, 0x88],
                [0x57, 0x00],
                [0x5a, 0x90],
                [0x5b, 0x2c],
                [0x5c, 0x05],
                [0xd3, 0x02],
                [0xe0, 0x00],
                [0xff, 0xff],
            ],
        };
    }
    static info() {
        return {
            name: "ArduCAMMini",
        };
    }
    wired(obniz) {
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.io_cs = obniz.getIO(this.params.cs);
        this.io_cs.output(true);
        obniz.wait(100);
        this.sensor_addr = 0x30; // i2c
        this.params.module_version = this.params.module_version || 0;
        this.params.mode = this.params.mode || "master";
        this.params.drive = this.params.spi_drive || "3v";
        this.params.frequency = this.params.spi_frequency || 4 * 1000 * 1000;
        this.params.clk = this.params.sclk;
        this.spi = this.obniz.getSpiWithConfig(this.params);
        this.params.sda = this.params.sda;
        this.params.scl = this.params.scl;
        this.params.clock = this.params.clock || 100 * 1000;
        this.params.mode = "master";
        this.params.pull = "5v";
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    spi_write(addr, byteData) {
        const data = [];
        data.push(addr);
        data.push(byteData);
        this.io_cs.output(false);
        this.spi.write(data);
        this.io_cs.output(true);
    }
    spi_readWait(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = [];
            data.push(addr);
            data.push(0x00);
            this.io_cs.output(false);
            const recv = yield this.spi.writeWait(data);
            this.io_cs.output(true);
            return recv[1];
        });
    }
    i2c_byte_write(addr, byteData) {
        this.i2c.write(this.sensor_addr, [addr, byteData]);
    }
    i2c_regs_write(regs) {
        for (let i = 0; i < regs.length; i++) {
            this.i2c.write(this.sensor_addr, regs[i]);
        }
    }
    spi_write_reg(addr, byteData) {
        this.spi_write(addr | 0x80, byteData);
    }
    spi_read_regWait(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.spi_readWait(addr & 0x7f);
        });
    }
    spi_pingpongWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const testVal = 0x55;
            this.spi_write_reg(this.regs.ARDUCHIP_TEST1, testVal);
            const val = yield this.spi_read_regWait(this.regs.ARDUCHIP_TEST1);
            if (val !== testVal) {
                throw new Error("spi bus fail");
            }
        });
    }
    setMode(mode) {
        const modes = {
            MCU2LCD: 0x00,
            CAM2LCD: 0x01,
            LCD2MCU: 0x02,
        };
        if (typeof modes[mode] !== "number") {
            throw new Error("unknown mode. options are " + modes);
        }
        this.spi_write_reg(this.regs.ARDUCHIP_MODE, modes[mode]);
    }
    getChipIdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.sensor_addr, [0x0a]);
            const val0 = yield this.i2c.readWait(this.sensor_addr, 1);
            this.i2c.write(this.sensor_addr, [0x0b]);
            const val1 = yield this.i2c.readWait(this.sensor_addr, 1);
            return (val0[0] << 8) + val1[0];
        });
    }
    init() {
        this.i2c_byte_write(0xff, 0x01);
        this.i2c_byte_write(0x12, 0x80);
        this.obniz.wait(100);
        this.i2c_regs_write(this.configs.OV2640_JPEG_INIT);
        this.i2c_regs_write(this.configs.OV2640_YUV422);
        this.i2c_regs_write(this.configs.OV2640_JPEG);
        this.i2c_byte_write(0xff, 0x01);
        this.i2c_byte_write(0x15, 0x00);
        this.setSize("320x240");
    }
    startupWait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.spi_pingpongWait();
            this.setMode("MCU2LCD");
            const chipid = yield this.getChipIdWait();
            if (chipid !== 0x2642 && chipid !== 0x2641) {
                throw new Error("unknown chip " + chipid);
            }
            this.init();
        });
    }
    takeWait(size) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof size === "string" && this._size !== size) {
                this.setSize(size);
                this.obniz.wait(1000);
            }
            this.flushFIFO();
            this.flushFIFO();
            this.startCapture();
            while (true) {
                if (yield this.isCaptureDoneWait()) {
                    break;
                }
            }
            return yield this.readFIFOWait();
        });
    }
    setSize(string) {
        if (this._size === string) {
            return;
        }
        const map = {
            "160x120": this.configs.OV2640_160x120_JPEG,
            "176x144": this.configs.OV2640_176x144_JPEG,
            "320x240": this.configs.OV2640_320x240_JPEG,
            "352x288": this.configs.OV2640_352x288_JPEG,
            "640x480": this.configs.OV2640_640x480_JPEG,
            "800x600": this.configs.OV2640_800x600_JPEG,
            "1024x768": this.configs.OV2640_1024x768_JPEG,
            "1280x960": this.configs.OV2640_1280x960_JPEG,
            "1600x1200": this.configs.OV2640_1600x1200_JPEG,
        };
        if (map[string]) {
            this._size = string;
            this.i2c_regs_write(map[string]);
        }
        else {
            throw new Error("unsupported size options are " + Object.keys(map));
        }
    }
    updateFIFO(data) {
        //  FIFO_CLEAR_MASK    		0x01
        //  FIFO_START_MASK    		0x02
        //  FIFO_RDPTR_RST_MASK     0x10
        //  FIFO_WRPTR_RST_MASK     0x20
        this.spi_write_reg(this.regs.ARDUCHIP_FIFO, data);
    }
    flushFIFO() {
        this.spi_write_reg(this.regs.ARDUCHIP_FIFO, 0x01);
    }
    readFIFOLengthWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const len1 = yield this.spi_read_regWait(this.regs.FIFO_SIZE1);
            const len2 = yield this.spi_read_regWait(this.regs.FIFO_SIZE2);
            const len3 = (yield this.spi_read_regWait(this.regs.FIFO_SIZE3)) & 0x07;
            return ((len3 << 16) | (len2 << 8) | len1) & 0x07ffff;
        });
    }
    startCapture() {
        this.spi_write_reg(this.regs.ARDUCHIP_FIFO, 0x02);
    }
    isCaptureDoneWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const CAP_DONE_MASK = 0x08;
            const val = yield this.spi_read_regWait(this.regs.ARDUCHIP_TRIG);
            return val & CAP_DONE_MASK ? true : false;
        });
    }
    readFIFOWait() {
        return __awaiter(this, void 0, void 0, function* () {
            // get length of image data
            const length = yield this.readFIFOLengthWait();
            // start bust
            this.io_cs.output(false);
            this.spi.write([this.regs.BURST_FIFO_READ]);
            if (this.params.module_version === 0) {
                this.spi.write([0xff]); // dummy read
            }
            const buf = [];
            while (buf.length < length) {
                let mustRead = length - buf.length;
                if (mustRead > 1024) {
                    mustRead = 1024;
                }
                const arr = new Array(mustRead);
                arr.fill(0);
                const sliced = yield this.spi.writeWait(arr);
                buf.push(...sliced);
            }
            // end burst
            this.io_cs.output(true);
            return buf;
        });
    }
    arrayToBase64(array) {
        return Buffer.from(array).toString("base64");
    }
}
exports.default = ArduCAMMini;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9DYW1lcmEvQXJkdUNBTU1pbmkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFdBQVc7SUFzQmY7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsSUFBSTtZQUNKLE1BQU07WUFDTixNQUFNO1lBQ04sTUFBTTtZQUNOLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLGVBQWU7WUFDZixXQUFXO1lBQ1gsZ0JBQWdCO1NBQ2pCLENBQUM7UUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXpCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDVixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsSUFBSTtZQUNuQixhQUFhLEVBQUUsSUFBSTtZQUNuQixlQUFlLEVBQUUsSUFBSTtZQUNyQixhQUFhLEVBQUUsSUFBSTtZQUNuQixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLGdCQUFnQixFQUFFO2dCQUNoQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osRUFBRTtnQkFDRixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELGFBQWEsRUFBRTtnQkFDYixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELFdBQVcsRUFBRTtnQkFDWCxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1lBRUQsbUJBQW1CLEVBQUU7Z0JBQ25CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1lBRUQsbUJBQW1CLEVBQUU7Z0JBQ25CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1lBRUQsbUJBQW1CLEVBQUU7Z0JBQ25CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1lBRUQsbUJBQW1CLEVBQUU7Z0JBQ25CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1lBRUQsbUJBQW1CLEVBQUU7Z0JBQ25CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBRVosQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELG1CQUFtQixFQUFFO2dCQUNuQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUVaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBRVosQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ2I7WUFFRCxvQkFBb0IsRUFBRTtnQkFDcEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFFWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFFWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUVELG9CQUFvQixFQUFFO2dCQUNwQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUVaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBRVosQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ2I7WUFFRCxxQkFBcUIsRUFBRTtnQkFDckIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFFWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDWixDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUVaLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQzthQUNiO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFocUJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsYUFBYTtTQUNwQixDQUFDO0lBQ0osQ0FBQztJQThwQk0sS0FBSyxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU07UUFFL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTSxTQUFTLENBQUMsSUFBUyxFQUFFLFFBQWE7UUFDdkMsTUFBTSxJQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRVksWUFBWSxDQUFDLElBQVM7O1lBQ2pDLE1BQU0sSUFBSSxHQUFRLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekIsTUFBTSxJQUFJLEdBQVEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixDQUFDO0tBQUE7SUFFTSxjQUFjLENBQUMsSUFBUyxFQUFFLFFBQWE7UUFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxjQUFjLENBQUMsSUFBUztRQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFTLEVBQUUsUUFBYTtRQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVZLGdCQUFnQixDQUFDLElBQVM7O1lBQ3JDLE9BQU8sTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM5QyxDQUFDO0tBQUE7SUFFWSxnQkFBZ0I7O1lBQzNCLE1BQU0sT0FBTyxHQUFRLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RELE1BQU0sR0FBRyxHQUFRLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDdkUsSUFBSSxHQUFHLEtBQUssT0FBTyxFQUFFO2dCQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ2pDO1FBQ0gsQ0FBQztLQUFBO0lBRU0sT0FBTyxDQUFDLElBQVM7UUFDdEIsTUFBTSxLQUFLLEdBQVE7WUFDakIsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUNGLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFWSxhQUFhOztZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLElBQUksR0FBUSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxJQUFJLEdBQVEsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7S0FBQTtJQUVNLElBQUk7UUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVZLFdBQVc7O1lBQ3RCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4QixNQUFNLE1BQU0sR0FBUSxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMvQyxJQUFJLE1BQU0sS0FBSyxNQUFNLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtnQkFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUM7YUFDM0M7WUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsSUFBUzs7WUFDN0IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0JBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3ZCO1lBRUQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsT0FBTyxJQUFJLEVBQUU7Z0JBQ1gsSUFBSSxNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO29CQUNsQyxNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxPQUFPLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ25DLENBQUM7S0FBQTtJQUVNLE9BQU8sQ0FBQyxNQUFXO1FBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7WUFDekIsT0FBTztTQUNSO1FBQ0QsTUFBTSxHQUFHLEdBQVE7WUFDZixTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUI7WUFDM0MsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CO1lBQzNDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQjtZQUMzQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUI7WUFDM0MsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CO1lBQzNDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQjtZQUMzQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7WUFDN0MsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CO1lBQzdDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQjtTQUNoRCxDQUFDO1FBQ0YsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNwQixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRTtJQUNILENBQUM7SUFFTSxVQUFVLENBQUMsSUFBUztRQUN6Qiw2QkFBNkI7UUFDN0IsNkJBQTZCO1FBQzdCLGdDQUFnQztRQUNoQyxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sU0FBUztRQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVZLGtCQUFrQjs7WUFDN0IsTUFBTSxJQUFJLEdBQVEsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwRSxNQUFNLElBQUksR0FBUSxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sSUFBSSxHQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM3RSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1FBQ3hELENBQUM7S0FBQTtJQUVNLFlBQVk7UUFDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRVksaUJBQWlCOztZQUM1QixNQUFNLGFBQWEsR0FBUSxJQUFJLENBQUM7WUFDaEMsTUFBTSxHQUFHLEdBQVEsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0RSxPQUFPLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzVDLENBQUM7S0FBQTtJQUVZLFlBQVk7O1lBQ3ZCLDJCQUEyQjtZQUMzQixNQUFNLE1BQU0sR0FBUSxNQUFNLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRXBELGFBQWE7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUU1QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTthQUN0QztZQUVELE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztZQUVwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFO2dCQUMxQixJQUFJLFFBQVEsR0FBUSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDeEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxFQUFFO29CQUNuQixRQUFRLEdBQUcsSUFBSSxDQUFDO2lCQUNqQjtnQkFDRCxNQUFNLEdBQUcsR0FBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLE1BQU0sR0FBUSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7YUFDckI7WUFDRCxZQUFZO1lBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEIsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFTSxhQUFhLENBQUMsS0FBVTtRQUM3QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDRjtBQUVELGtCQUFlLFdBQVcsQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvQ2FtZXJhL0FyZHVDQU1NaW5pL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXJkdUNBTU1pbmkge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJBcmR1Q0FNTWluaVwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMga2V5czogYW55O1xuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBpb0tleXM6IGFueTtcbiAgcHVibGljIGRpc3BsYXlOYW1lOiBhbnk7XG4gIHB1YmxpYyByZWdzOiBhbnk7XG4gIHB1YmxpYyBjb25maWdzOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyBpb19jczogYW55O1xuICBwdWJsaWMgc2Vuc29yX2FkZHI6IGFueTtcbiAgcHVibGljIHNwaTogYW55O1xuICBwdWJsaWMgaTJjOiBhbnk7XG4gIHB1YmxpYyBfc2l6ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcbiAgICAgIFwiY3NcIixcbiAgICAgIFwibW9zaVwiLFxuICAgICAgXCJtaXNvXCIsXG4gICAgICBcInNjbGtcIixcbiAgICAgIFwiZ25kXCIsXG4gICAgICBcInZjY1wiLFxuICAgICAgXCJzZGFcIixcbiAgICAgIFwic2NsXCIsXG4gICAgICBcInNwaVwiLFxuICAgICAgXCJpMmNcIixcbiAgICAgIFwic3BpX2ZyZXF1ZW5jeVwiLFxuICAgICAgXCJzcGlfZHJpdmVcIixcbiAgICAgIFwibW9kdWxlX3ZlcnNpb25cIixcbiAgICBdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW1wiY3NcIl07XG5cbiAgICB0aGlzLmlvS2V5cyA9IHRoaXMua2V5cztcbiAgICB0aGlzLmRpc3BsYXlOYW1lID0gXCJDYW1cIjtcblxuICAgIHRoaXMucmVncyA9IHtcbiAgICAgIEFSRFVDSElQX1RFU1QxOiAweDAwLFxuICAgICAgQVJEVUNISVBfTU9ERTogMHgwMixcbiAgICAgIEFSRFVDSElQX0ZJRk86IDB4MDQsXG4gICAgICBCVVJTVF9GSUZPX1JFQUQ6IDB4M2MsXG4gICAgICBBUkRVQ0hJUF9UUklHOiAweDQxLFxuICAgICAgRklGT19TSVpFMTogMHg0MixcbiAgICAgIEZJRk9fU0laRTI6IDB4NDMsXG4gICAgICBGSUZPX1NJWkUzOiAweDQ0LFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3MgPSB7XG4gICAgICBPVjI2NDBfSlBFR19JTklUOiBbXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4MmMsIDB4ZmZdLFxuICAgICAgICBbMHgyZSwgMHhkZl0sXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4M2MsIDB4MzJdLFxuICAgICAgICBbMHgxMSwgMHgwNF0sXG4gICAgICAgIFsweDA5LCAweDAyXSxcbiAgICAgICAgWzB4MDQsIDB4MjhdLFxuICAgICAgICBbMHgxMywgMHhlNV0sXG4gICAgICAgIFsweDE0LCAweDQ4XSxcbiAgICAgICAgWzB4MmMsIDB4MGNdLFxuICAgICAgICBbMHgzMywgMHg3OF0sXG4gICAgICAgIFsweDNhLCAweDMzXSxcbiAgICAgICAgWzB4M2IsIDB4ZmJdLFxuICAgICAgICBbMHgzZSwgMHgwMF0sXG4gICAgICAgIFsweDQzLCAweDExXSxcbiAgICAgICAgWzB4MTYsIDB4MTBdLFxuICAgICAgICBbMHgzOSwgMHg5Ml0sXG4gICAgICAgIFsweDM1LCAweGRhXSxcbiAgICAgICAgWzB4MjIsIDB4MWFdLFxuICAgICAgICBbMHgzNywgMHhjM10sXG4gICAgICAgIFsweDIzLCAweDAwXSxcbiAgICAgICAgWzB4MzQsIDB4YzBdLFxuICAgICAgICBbMHgzNiwgMHgxYV0sXG4gICAgICAgIFsweDA2LCAweDg4XSxcbiAgICAgICAgWzB4MDcsIDB4YzBdLFxuICAgICAgICBbMHgwZCwgMHg4N10sXG4gICAgICAgIFsweDBlLCAweDQxXSxcbiAgICAgICAgWzB4NGMsIDB4MDBdLFxuICAgICAgICBbMHg0OCwgMHgwMF0sXG4gICAgICAgIFsweDViLCAweDAwXSxcbiAgICAgICAgWzB4NDIsIDB4MDNdLFxuICAgICAgICBbMHg0YSwgMHg4MV0sXG4gICAgICAgIFsweDIxLCAweDk5XSxcbiAgICAgICAgWzB4MjQsIDB4NDBdLFxuICAgICAgICBbMHgyNSwgMHgzOF0sXG4gICAgICAgIFsweDI2LCAweDgyXSxcbiAgICAgICAgWzB4NWMsIDB4MDBdLFxuICAgICAgICBbMHg2MywgMHgwMF0sXG4gICAgICAgIFsweDYxLCAweDcwXSxcbiAgICAgICAgWzB4NjIsIDB4ODBdLFxuICAgICAgICBbMHg3YywgMHgwNV0sXG4gICAgICAgIFsweDIwLCAweDgwXSxcbiAgICAgICAgWzB4MjgsIDB4MzBdLFxuICAgICAgICBbMHg2YywgMHgwMF0sXG4gICAgICAgIFsweDZkLCAweDgwXSxcbiAgICAgICAgWzB4NmUsIDB4MDBdLFxuICAgICAgICBbMHg3MCwgMHgwMl0sXG4gICAgICAgIFsweDcxLCAweDk0XSxcbiAgICAgICAgWzB4NzMsIDB4YzFdLFxuICAgICAgICBbMHgxMiwgMHg0MF0sXG4gICAgICAgIFsweDE3LCAweDExXSxcbiAgICAgICAgWzB4MTgsIDB4NDNdLFxuICAgICAgICBbMHgxOSwgMHgwMF0sXG4gICAgICAgIFsweDFhLCAweDRiXSxcbiAgICAgICAgWzB4MzIsIDB4MDldLFxuICAgICAgICBbMHgzNywgMHhjMF0sXG4gICAgICAgIFsweDRmLCAweDYwXSxcbiAgICAgICAgWzB4NTAsIDB4YThdLFxuICAgICAgICBbMHg2ZCwgMHgwMF0sXG4gICAgICAgIFsweDNkLCAweDM4XSxcbiAgICAgICAgWzB4NDYsIDB4M2ZdLFxuICAgICAgICBbMHg0ZiwgMHg2MF0sXG4gICAgICAgIFsweDBjLCAweDNjXSxcbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlNSwgMHg3Zl0sXG4gICAgICAgIFsweGY5LCAweGMwXSxcbiAgICAgICAgWzB4NDEsIDB4MjRdLFxuICAgICAgICBbMHhlMCwgMHgxNF0sXG4gICAgICAgIFsweDc2LCAweGZmXSxcbiAgICAgICAgWzB4MzMsIDB4YTBdLFxuICAgICAgICBbMHg0MiwgMHgyMF0sXG4gICAgICAgIFsweDQzLCAweDE4XSxcbiAgICAgICAgWzB4NGMsIDB4MDBdLFxuICAgICAgICBbMHg4NywgMHhkNV0sXG4gICAgICAgIFsweDg4LCAweDNmXSxcbiAgICAgICAgWzB4ZDcsIDB4MDNdLFxuICAgICAgICBbMHhkOSwgMHgxMF0sXG4gICAgICAgIFsweGQzLCAweDgyXSxcbiAgICAgICAgWzB4YzgsIDB4MDhdLFxuICAgICAgICBbMHhjOSwgMHg4MF0sXG4gICAgICAgIFsweDdjLCAweDAwXSxcbiAgICAgICAgWzB4N2QsIDB4MDBdLFxuICAgICAgICBbMHg3YywgMHgwM10sXG4gICAgICAgIFsweDdkLCAweDQ4XSxcbiAgICAgICAgWzB4N2QsIDB4NDhdLFxuICAgICAgICBbMHg3YywgMHgwOF0sXG4gICAgICAgIFsweDdkLCAweDIwXSxcbiAgICAgICAgWzB4N2QsIDB4MTBdLFxuICAgICAgICBbMHg3ZCwgMHgwZV0sXG4gICAgICAgIFsweDkwLCAweDAwXSxcbiAgICAgICAgWzB4OTEsIDB4MGVdLFxuICAgICAgICBbMHg5MSwgMHgxYV0sXG4gICAgICAgIFsweDkxLCAweDMxXSxcbiAgICAgICAgWzB4OTEsIDB4NWFdLFxuICAgICAgICBbMHg5MSwgMHg2OV0sXG4gICAgICAgIFsweDkxLCAweDc1XSxcbiAgICAgICAgWzB4OTEsIDB4N2VdLFxuICAgICAgICBbMHg5MSwgMHg4OF0sXG4gICAgICAgIFsweDkxLCAweDhmXSxcbiAgICAgICAgWzB4OTEsIDB4OTZdLFxuICAgICAgICBbMHg5MSwgMHhhM10sXG4gICAgICAgIFsweDkxLCAweGFmXSxcbiAgICAgICAgWzB4OTEsIDB4YzRdLFxuICAgICAgICBbMHg5MSwgMHhkN10sXG4gICAgICAgIFsweDkxLCAweGU4XSxcbiAgICAgICAgWzB4OTEsIDB4MjBdLFxuICAgICAgICBbMHg5MiwgMHgwMF0sXG4gICAgICAgIFsweDkzLCAweDA2XSxcbiAgICAgICAgWzB4OTMsIDB4ZTNdLFxuICAgICAgICBbMHg5MywgMHgwNV0sXG4gICAgICAgIFsweDkzLCAweDA1XSxcbiAgICAgICAgWzB4OTMsIDB4MDBdLFxuICAgICAgICBbMHg5MywgMHgwNF0sXG4gICAgICAgIFsweDkzLCAweDAwXSxcbiAgICAgICAgWzB4OTMsIDB4MDBdLFxuICAgICAgICBbMHg5MywgMHgwMF0sXG4gICAgICAgIFsweDkzLCAweDAwXSxcbiAgICAgICAgWzB4OTMsIDB4MDBdLFxuICAgICAgICBbMHg5MywgMHgwMF0sXG4gICAgICAgIFsweDkzLCAweDAwXSxcbiAgICAgICAgWzB4OTYsIDB4MDBdLFxuICAgICAgICBbMHg5NywgMHgwOF0sXG4gICAgICAgIFsweDk3LCAweDE5XSxcbiAgICAgICAgWzB4OTcsIDB4MDJdLFxuICAgICAgICBbMHg5NywgMHgwY10sXG4gICAgICAgIFsweDk3LCAweDI0XSxcbiAgICAgICAgWzB4OTcsIDB4MzBdLFxuICAgICAgICBbMHg5NywgMHgyOF0sXG4gICAgICAgIFsweDk3LCAweDI2XSxcbiAgICAgICAgWzB4OTcsIDB4MDJdLFxuICAgICAgICBbMHg5NywgMHg5OF0sXG4gICAgICAgIFsweDk3LCAweDgwXSxcbiAgICAgICAgWzB4OTcsIDB4MDBdLFxuICAgICAgICBbMHg5NywgMHgwMF0sXG4gICAgICAgIFsweGMzLCAweGVkXSxcbiAgICAgICAgWzB4YTQsIDB4MDBdLFxuICAgICAgICBbMHhhOCwgMHgwMF0sXG4gICAgICAgIFsweGM1LCAweDExXSxcbiAgICAgICAgWzB4YzYsIDB4NTFdLFxuICAgICAgICBbMHhiZiwgMHg4MF0sXG4gICAgICAgIFsweGM3LCAweDEwXSxcbiAgICAgICAgWzB4YjYsIDB4NjZdLFxuICAgICAgICBbMHhiOCwgMHhhNV0sXG4gICAgICAgIFsweGI3LCAweDY0XSxcbiAgICAgICAgWzB4YjksIDB4N2NdLFxuICAgICAgICBbMHhiMywgMHhhZl0sXG4gICAgICAgIFsweGI0LCAweDk3XSxcbiAgICAgICAgWzB4YjUsIDB4ZmZdLFxuICAgICAgICBbMHhiMCwgMHhjNV0sXG4gICAgICAgIFsweGIxLCAweDk0XSxcbiAgICAgICAgWzB4YjIsIDB4MGZdLFxuICAgICAgICBbMHhjNCwgMHg1Y10sXG4gICAgICAgIFsweGMwLCAweDY0XSxcbiAgICAgICAgWzB4YzEsIDB4NGJdLFxuICAgICAgICBbMHg4YywgMHgwMF0sXG4gICAgICAgIFsweDg2LCAweDNkXSxcbiAgICAgICAgWzB4NTAsIDB4MDBdLFxuICAgICAgICBbMHg1MSwgMHhjOF0sXG4gICAgICAgIFsweDUyLCAweDk2XSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4YzhdLFxuICAgICAgICBbMHg1YiwgMHg5Nl0sXG4gICAgICAgIFsweDVjLCAweDAwXSxcbiAgICAgICAgWzB4ZDMsIDB4MDBdLCAvLyBbIDB4ZDMsIDB4N2YgXSxcbiAgICAgICAgWzB4YzMsIDB4ZWRdLFxuICAgICAgICBbMHg3ZiwgMHgwMF0sXG4gICAgICAgIFsweGRhLCAweDAwXSxcbiAgICAgICAgWzB4ZTUsIDB4MWZdLFxuICAgICAgICBbMHhlMSwgMHg2N10sXG4gICAgICAgIFsweGUwLCAweDAwXSxcbiAgICAgICAgWzB4ZGQsIDB4N2ZdLFxuICAgICAgICBbMHgwNSwgMHgwMF0sXG4gICAgICAgIC8vXG4gICAgICAgIFsweDEyLCAweDQwXSxcbiAgICAgICAgWzB4ZDMsIDB4MDRdLCAvLyBbIDB4ZDMsIDB4N2YgXSxcbiAgICAgICAgWzB4YzAsIDB4MTZdLFxuICAgICAgICBbMHhjMSwgMHgxMl0sXG4gICAgICAgIFsweDhjLCAweDAwXSxcbiAgICAgICAgWzB4ODYsIDB4M2RdLFxuICAgICAgICBbMHg1MCwgMHgwMF0sXG4gICAgICAgIFsweDUxLCAweDJjXSxcbiAgICAgICAgWzB4NTIsIDB4MjRdLFxuICAgICAgICBbMHg1MywgMHgwMF0sXG4gICAgICAgIFsweDU0LCAweDAwXSxcbiAgICAgICAgWzB4NTUsIDB4MDBdLFxuICAgICAgICBbMHg1YSwgMHgyY10sXG4gICAgICAgIFsweDViLCAweDI0XSxcbiAgICAgICAgWzB4NWMsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfWVVWNDIyOiBbXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4MDUsIDB4MDBdLFxuICAgICAgICBbMHhkYSwgMHgxMF0sXG4gICAgICAgIFsweGQ3LCAweDAzXSxcbiAgICAgICAgWzB4ZGYsIDB4MDBdLFxuICAgICAgICBbMHgzMywgMHg4MF0sXG4gICAgICAgIFsweDNjLCAweDQwXSxcbiAgICAgICAgWzB4ZTEsIDB4NzddLFxuICAgICAgICBbMHgwMCwgMHgwMF0sXG4gICAgICAgIFsweGZmLCAweGZmXSxcbiAgICAgIF0sXG5cbiAgICAgIE9WMjY0MF9KUEVHOiBbXG4gICAgICAgIFsweGUwLCAweDE0XSxcbiAgICAgICAgWzB4ZTEsIDB4NzddLFxuICAgICAgICBbMHhlNSwgMHgxZl0sXG4gICAgICAgIFsweGQ3LCAweDAzXSxcbiAgICAgICAgWzB4ZGEsIDB4MTBdLFxuICAgICAgICBbMHhlMCwgMHgwMF0sXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MDQsIDB4MDhdLFxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfMTYweDEyMF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTIsIDB4NDBdLFxuICAgICAgICBbMHgxNywgMHgxMV0sXG4gICAgICAgIFsweDE4LCAweDQzXSxcbiAgICAgICAgWzB4MTksIDB4MDBdLFxuICAgICAgICBbMHgxYSwgMHg0Yl0sXG4gICAgICAgIFsweDMyLCAweDA5XSxcbiAgICAgICAgWzB4NGYsIDB4Y2FdLFxuICAgICAgICBbMHg1MCwgMHhhOF0sXG4gICAgICAgIFsweDVhLCAweDIzXSxcbiAgICAgICAgWzB4NmQsIDB4MDBdLFxuICAgICAgICBbMHgzOSwgMHgxMl0sXG4gICAgICAgIFsweDM1LCAweGRhXSxcbiAgICAgICAgWzB4MjIsIDB4MWFdLFxuICAgICAgICBbMHgzNywgMHhjM10sXG4gICAgICAgIFsweDIzLCAweDAwXSxcbiAgICAgICAgWzB4MzQsIDB4YzBdLFxuICAgICAgICBbMHgzNiwgMHgxYV0sXG4gICAgICAgIFsweDA2LCAweDg4XSxcbiAgICAgICAgWzB4MDcsIDB4YzBdLFxuICAgICAgICBbMHgwZCwgMHg4N10sXG4gICAgICAgIFsweDBlLCAweDQxXSxcbiAgICAgICAgWzB4NGMsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHgwMF0sXG4gICAgICAgIFsweGUwLCAweDA0XSxcbiAgICAgICAgWzB4YzAsIDB4NjRdLFxuICAgICAgICBbMHhjMSwgMHg0Yl0sXG4gICAgICAgIFsweDg2LCAweDM1XSxcbiAgICAgICAgWzB4NTAsIDB4OTJdLFxuICAgICAgICBbMHg1MSwgMHhjOF0sXG4gICAgICAgIFsweDUyLCAweDk2XSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDAwXSxcbiAgICAgICAgWzB4NTcsIDB4MDBdLFxuICAgICAgICBbMHg1YSwgMHgyOF0sXG4gICAgICAgIFsweDViLCAweDFlXSxcbiAgICAgICAgWzB4NWMsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwMF0sXG4gICAgICAgIFsweGZmLCAweGZmXSxcbiAgICAgIF0sXG5cbiAgICAgIE9WMjY0MF8xNzZ4MTQ0X0pQRUc6IFtcbiAgICAgICAgWzB4ZmYsIDB4MDFdLFxuICAgICAgICBbMHgxMiwgMHg0MF0sXG4gICAgICAgIFsweDE3LCAweDExXSxcbiAgICAgICAgWzB4MTgsIDB4NDNdLFxuICAgICAgICBbMHgxOSwgMHgwMF0sXG4gICAgICAgIFsweDFhLCAweDRiXSxcbiAgICAgICAgWzB4MzIsIDB4MDldLFxuICAgICAgICBbMHg0ZiwgMHhjYV0sXG4gICAgICAgIFsweDUwLCAweGE4XSxcbiAgICAgICAgWzB4NWEsIDB4MjNdLFxuICAgICAgICBbMHg2ZCwgMHgwMF0sXG4gICAgICAgIFsweDM5LCAweDEyXSxcbiAgICAgICAgWzB4MzUsIDB4ZGFdLFxuICAgICAgICBbMHgyMiwgMHgxYV0sXG4gICAgICAgIFsweDM3LCAweGMzXSxcbiAgICAgICAgWzB4MjMsIDB4MDBdLFxuICAgICAgICBbMHgzNCwgMHhjMF0sXG4gICAgICAgIFsweDM2LCAweDFhXSxcbiAgICAgICAgWzB4MDYsIDB4ODhdLFxuICAgICAgICBbMHgwNywgMHhjMF0sXG4gICAgICAgIFsweDBkLCAweDg3XSxcbiAgICAgICAgWzB4MGUsIDB4NDFdLFxuICAgICAgICBbMHg0YywgMHgwMF0sXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDRdLFxuICAgICAgICBbMHhjMCwgMHg2NF0sXG4gICAgICAgIFsweGMxLCAweDRiXSxcbiAgICAgICAgWzB4ODYsIDB4MzVdLFxuICAgICAgICBbMHg1MCwgMHg5Ml0sXG4gICAgICAgIFsweDUxLCAweGM4XSxcbiAgICAgICAgWzB4NTIsIDB4OTZdLFxuICAgICAgICBbMHg1MywgMHgwMF0sXG4gICAgICAgIFsweDU0LCAweDAwXSxcbiAgICAgICAgWzB4NTUsIDB4MDBdLFxuICAgICAgICBbMHg1NywgMHgwMF0sXG4gICAgICAgIFsweDVhLCAweDJjXSxcbiAgICAgICAgWzB4NWIsIDB4MjRdLFxuICAgICAgICBbMHg1YywgMHgwMF0sXG4gICAgICAgIFsweGUwLCAweDAwXSxcbiAgICAgICAgWzB4ZmYsIDB4ZmZdLFxuICAgICAgXSxcblxuICAgICAgT1YyNjQwXzMyMHgyNDBfSlBFRzogW1xuICAgICAgICBbMHhmZiwgMHgwMV0sXG4gICAgICAgIFsweDEyLCAweDQwXSxcbiAgICAgICAgWzB4MTcsIDB4MTFdLFxuICAgICAgICBbMHgxOCwgMHg0M10sXG4gICAgICAgIFsweDE5LCAweDAwXSxcbiAgICAgICAgWzB4MWEsIDB4NGJdLFxuICAgICAgICBbMHgzMiwgMHgwOV0sXG4gICAgICAgIFsweDRmLCAweGNhXSxcbiAgICAgICAgWzB4NTAsIDB4YThdLFxuICAgICAgICBbMHg1YSwgMHgyM10sXG4gICAgICAgIFsweDZkLCAweDAwXSxcbiAgICAgICAgWzB4MzksIDB4MTJdLFxuICAgICAgICBbMHgzNSwgMHhkYV0sXG4gICAgICAgIFsweDIyLCAweDFhXSxcbiAgICAgICAgWzB4MzcsIDB4YzNdLFxuICAgICAgICBbMHgyMywgMHgwMF0sXG4gICAgICAgIFsweDM0LCAweGMwXSxcbiAgICAgICAgWzB4MzYsIDB4MWFdLFxuICAgICAgICBbMHgwNiwgMHg4OF0sXG4gICAgICAgIFsweDA3LCAweGMwXSxcbiAgICAgICAgWzB4MGQsIDB4ODddLFxuICAgICAgICBbMHgwZSwgMHg0MV0sXG4gICAgICAgIFsweDRjLCAweDAwXSxcbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwNF0sXG4gICAgICAgIFsweGMwLCAweDY0XSxcbiAgICAgICAgWzB4YzEsIDB4NGJdLFxuICAgICAgICBbMHg4NiwgMHgzNV0sXG4gICAgICAgIFsweDUwLCAweDg5XSxcbiAgICAgICAgWzB4NTEsIDB4YzhdLFxuICAgICAgICBbMHg1MiwgMHg5Nl0sXG4gICAgICAgIFsweDUzLCAweDAwXSxcbiAgICAgICAgWzB4NTQsIDB4MDBdLFxuICAgICAgICBbMHg1NSwgMHgwMF0sXG4gICAgICAgIFsweDU3LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4NTBdLFxuICAgICAgICBbMHg1YiwgMHgzY10sXG4gICAgICAgIFsweDVjLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfMzUyeDI4OF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTIsIDB4NDBdLFxuICAgICAgICBbMHgxNywgMHgxMV0sXG4gICAgICAgIFsweDE4LCAweDQzXSxcbiAgICAgICAgWzB4MTksIDB4MDBdLFxuICAgICAgICBbMHgxYSwgMHg0Yl0sXG4gICAgICAgIFsweDMyLCAweDA5XSxcbiAgICAgICAgWzB4NGYsIDB4Y2FdLFxuICAgICAgICBbMHg1MCwgMHhhOF0sXG4gICAgICAgIFsweDVhLCAweDIzXSxcbiAgICAgICAgWzB4NmQsIDB4MDBdLFxuICAgICAgICBbMHgzOSwgMHgxMl0sXG4gICAgICAgIFsweDM1LCAweGRhXSxcbiAgICAgICAgWzB4MjIsIDB4MWFdLFxuICAgICAgICBbMHgzNywgMHhjM10sXG4gICAgICAgIFsweDIzLCAweDAwXSxcbiAgICAgICAgWzB4MzQsIDB4YzBdLFxuICAgICAgICBbMHgzNiwgMHgxYV0sXG4gICAgICAgIFsweDA2LCAweDg4XSxcbiAgICAgICAgWzB4MDcsIDB4YzBdLFxuICAgICAgICBbMHgwZCwgMHg4N10sXG4gICAgICAgIFsweDBlLCAweDQxXSxcbiAgICAgICAgWzB4NGMsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHgwMF0sXG4gICAgICAgIFsweGUwLCAweDA0XSxcbiAgICAgICAgWzB4YzAsIDB4NjRdLFxuICAgICAgICBbMHhjMSwgMHg0Yl0sXG4gICAgICAgIFsweDg2LCAweDM1XSxcbiAgICAgICAgWzB4NTAsIDB4ODldLFxuICAgICAgICBbMHg1MSwgMHhjOF0sXG4gICAgICAgIFsweDUyLCAweDk2XSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDAwXSxcbiAgICAgICAgWzB4NTcsIDB4MDBdLFxuICAgICAgICBbMHg1YSwgMHg1OF0sXG4gICAgICAgIFsweDViLCAweDQ4XSxcbiAgICAgICAgWzB4NWMsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwMF0sXG4gICAgICAgIFsweGZmLCAweGZmXSxcbiAgICAgIF0sXG5cbiAgICAgIE9WMjY0MF82NDB4NDgwX0pQRUc6IFtcbiAgICAgICAgWzB4ZmYsIDB4MDFdLFxuICAgICAgICBbMHgxMSwgMHgwMV0sXG4gICAgICAgIFsweDEyLCAweDAwXSwgLy8gQml0WzY6NF06IFJlc29sdXRpb24gc2VsZWN0aW9uLy9cbiAgICAgICAgWzB4MTcsIDB4MTFdLCAvLyBIUkVGU1RbMTA6M11cbiAgICAgICAgWzB4MTgsIDB4NzVdLCAvLyBIUkVGRU5EWzEwOjNdXG4gICAgICAgIFsweDMyLCAweDM2XSwgLy8gQml0WzU6M106IEhSRUZFTkRbMjowXTsgQml0WzI6MF06IEhSRUZTVFsyOjBdXG4gICAgICAgIFsweDE5LCAweDAxXSwgLy8gVlNUUlRbOToyXVxuICAgICAgICBbMHgxYSwgMHg5N10sIC8vIFZFTkRbOToyXVxuICAgICAgICBbMHgwMywgMHgwZl0sIC8vIEJpdFszOjJdOiBWRU5EWzE6MF07IEJpdFsxOjBdOiBWU1RSVFsxOjBdXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4NGYsIDB4YmJdLFxuICAgICAgICBbMHg1MCwgMHg5Y10sXG4gICAgICAgIFsweDVhLCAweDU3XSxcbiAgICAgICAgWzB4NmQsIDB4ODBdLFxuICAgICAgICBbMHgzZCwgMHgzNF0sXG4gICAgICAgIFsweDM5LCAweDAyXSxcbiAgICAgICAgWzB4MzUsIDB4ODhdLFxuICAgICAgICBbMHgyMiwgMHgwYV0sXG4gICAgICAgIFsweDM3LCAweDQwXSxcbiAgICAgICAgWzB4MzQsIDB4YTBdLFxuICAgICAgICBbMHgwNiwgMHgwMl0sXG4gICAgICAgIFsweDBkLCAweGI3XSxcbiAgICAgICAgWzB4MGUsIDB4MDFdLFxuXG4gICAgICAgIFsweGZmLCAweDAwXSxcbiAgICAgICAgWzB4ZTAsIDB4MDRdLFxuICAgICAgICBbMHhjMCwgMHhjOF0sXG4gICAgICAgIFsweGMxLCAweDk2XSxcbiAgICAgICAgWzB4ODYsIDB4M2RdLFxuICAgICAgICBbMHg1MCwgMHg4OV0sXG4gICAgICAgIFsweDUxLCAweDkwXSxcbiAgICAgICAgWzB4NTIsIDB4MmNdLFxuICAgICAgICBbMHg1MywgMHgwMF0sXG4gICAgICAgIFsweDU0LCAweDAwXSxcbiAgICAgICAgWzB4NTUsIDB4ODhdLFxuICAgICAgICBbMHg1NywgMHgwMF0sXG4gICAgICAgIFsweDVhLCAweGEwXSxcbiAgICAgICAgWzB4NWIsIDB4NzhdLFxuICAgICAgICBbMHg1YywgMHgwMF0sXG4gICAgICAgIFsweGQzLCAweDA0XSxcbiAgICAgICAgWzB4ZTAsIDB4MDBdLFxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuXG4gICAgICBPVjI2NDBfODAweDYwMF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTEsIDB4MDFdLFxuICAgICAgICBbMHgxMiwgMHgwMF0sIC8vIEJpdFs2OjRdOiBSZXNvbHV0aW9uIHNlbGVjdGlvblxuICAgICAgICBbMHgxNywgMHgxMV0sIC8vIEhSRUZTVFsxMDozXVxuICAgICAgICBbMHgxOCwgMHg3NV0sIC8vIEhSRUZFTkRbMTA6M11cbiAgICAgICAgWzB4MzIsIDB4MzZdLCAvLyBCaXRbNTozXTogSFJFRkVORFsyOjBdOyBCaXRbMjowXTogSFJFRlNUWzI6MF1cbiAgICAgICAgWzB4MTksIDB4MDFdLCAvLyBWU1RSVFs5OjJdXG4gICAgICAgIFsweDFhLCAweDk3XSwgLy8gVkVORFs5OjJdXG4gICAgICAgIFsweDAzLCAweDBmXSwgLy8gQml0WzM6Ml06IFZFTkRbMTowXTsgQml0WzE6MF06IFZTVFJUWzE6MF1cbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHg0ZiwgMHhiYl0sXG4gICAgICAgIFsweDUwLCAweDljXSxcbiAgICAgICAgWzB4NWEsIDB4NTddLFxuICAgICAgICBbMHg2ZCwgMHg4MF0sXG4gICAgICAgIFsweDNkLCAweDM0XSxcbiAgICAgICAgWzB4MzksIDB4MDJdLFxuICAgICAgICBbMHgzNSwgMHg4OF0sXG4gICAgICAgIFsweDIyLCAweDBhXSxcbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHgzNCwgMHhhMF0sXG4gICAgICAgIFsweDA2LCAweDAyXSxcbiAgICAgICAgWzB4MGQsIDB4YjddLFxuICAgICAgICBbMHgwZSwgMHgwMV0sXG5cbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwNF0sXG4gICAgICAgIFsweGMwLCAweGM4XSxcbiAgICAgICAgWzB4YzEsIDB4OTZdLFxuICAgICAgICBbMHg4NiwgMHgzNV0sXG4gICAgICAgIFsweDUwLCAweDg5XSxcbiAgICAgICAgWzB4NTEsIDB4OTBdLFxuICAgICAgICBbMHg1MiwgMHgyY10sXG4gICAgICAgIFsweDUzLCAweDAwXSxcbiAgICAgICAgWzB4NTQsIDB4MDBdLFxuICAgICAgICBbMHg1NSwgMHg4OF0sXG4gICAgICAgIFsweDU3LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4YzhdLFxuICAgICAgICBbMHg1YiwgMHg5Nl0sXG4gICAgICAgIFsweDVjLCAweDAwXSxcbiAgICAgICAgWzB4ZDMsIDB4MDJdLFxuICAgICAgICBbMHhlMCwgMHgwMF0sXG5cbiAgICAgICAgWzB4ZmYsIDB4ZmZdLFxuICAgICAgXSxcblxuICAgICAgT1YyNjQwXzEwMjR4NzY4X0pQRUc6IFtcbiAgICAgICAgWzB4ZmYsIDB4MDFdLFxuICAgICAgICBbMHgxMSwgMHgwMV0sXG4gICAgICAgIFsweDEyLCAweDAwXSwgLy8gQml0WzY6NF06IFJlc29sdXRpb24gc2VsZWN0aW9uLy8weDAyXG4gICAgICAgIFsweDE3LCAweDExXSwgLy8gSFJFRlNUWzEwOjNdXG4gICAgICAgIFsweDE4LCAweDc1XSwgLy8gSFJFRkVORFsxMDozXVxuICAgICAgICBbMHgzMiwgMHgzNl0sIC8vIEJpdFs1OjNdOiBIUkVGRU5EWzI6MF07IEJpdFsyOjBdOiBIUkVGU1RbMjowXVxuICAgICAgICBbMHgxOSwgMHgwMV0sIC8vIFZTVFJUWzk6Ml1cbiAgICAgICAgWzB4MWEsIDB4OTddLCAvLyBWRU5EWzk6Ml1cbiAgICAgICAgWzB4MDMsIDB4MGZdLCAvLyBCaXRbMzoyXTogVkVORFsxOjBdOyBCaXRbMTowXTogVlNUUlRbMTowXVxuICAgICAgICBbMHgzNywgMHg0MF0sXG4gICAgICAgIFsweDRmLCAweGJiXSxcbiAgICAgICAgWzB4NTAsIDB4OWNdLFxuICAgICAgICBbMHg1YSwgMHg1N10sXG4gICAgICAgIFsweDZkLCAweDgwXSxcbiAgICAgICAgWzB4M2QsIDB4MzRdLFxuICAgICAgICBbMHgzOSwgMHgwMl0sXG4gICAgICAgIFsweDM1LCAweDg4XSxcbiAgICAgICAgWzB4MjIsIDB4MGFdLFxuICAgICAgICBbMHgzNywgMHg0MF0sXG4gICAgICAgIFsweDM0LCAweGEwXSxcbiAgICAgICAgWzB4MDYsIDB4MDJdLFxuICAgICAgICBbMHgwZCwgMHhiN10sXG4gICAgICAgIFsweDBlLCAweDAxXSxcblxuICAgICAgICBbMHhmZiwgMHgwMF0sXG4gICAgICAgIFsweGMwLCAweGM4XSxcbiAgICAgICAgWzB4YzEsIDB4OTZdLFxuICAgICAgICBbMHg4YywgMHgwMF0sXG4gICAgICAgIFsweDg2LCAweDNkXSxcbiAgICAgICAgWzB4NTAsIDB4MDBdLFxuICAgICAgICBbMHg1MSwgMHg5MF0sXG4gICAgICAgIFsweDUyLCAweDJjXSxcbiAgICAgICAgWzB4NTMsIDB4MDBdLFxuICAgICAgICBbMHg1NCwgMHgwMF0sXG4gICAgICAgIFsweDU1LCAweDg4XSxcbiAgICAgICAgWzB4NWEsIDB4MDBdLFxuICAgICAgICBbMHg1YiwgMHhjMF0sXG4gICAgICAgIFsweDVjLCAweDAxXSxcbiAgICAgICAgWzB4ZDMsIDB4MDJdLFxuXG4gICAgICAgIFsweGZmLCAweGZmXSxcbiAgICAgIF0sXG5cbiAgICAgIE9WMjY0MF8xMjgweDk2MF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTEsIDB4MDFdLFxuICAgICAgICBbMHgxMiwgMHgwMF0sIC8vIEJpdFs2OjRdOiBSZXNvbHV0aW9uIHNlbGVjdGlvbi8vMHgwMlxuICAgICAgICBbMHgxNywgMHgxMV0sIC8vIEhSRUZTVFsxMDozXVxuICAgICAgICBbMHgxOCwgMHg3NV0sIC8vIEhSRUZFTkRbMTA6M11cbiAgICAgICAgWzB4MzIsIDB4MzZdLCAvLyBCaXRbNTozXTogSFJFRkVORFsyOjBdOyBCaXRbMjowXTogSFJFRlNUWzI6MF1cbiAgICAgICAgWzB4MTksIDB4MDFdLCAvLyBWU1RSVFs5OjJdXG4gICAgICAgIFsweDFhLCAweDk3XSwgLy8gVkVORFs5OjJdXG4gICAgICAgIFsweDAzLCAweDBmXSwgLy8gQml0WzM6Ml06IFZFTkRbMTowXTsgQml0WzE6MF06IFZTVFJUWzE6MF1cbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHg0ZiwgMHhiYl0sXG4gICAgICAgIFsweDUwLCAweDljXSxcbiAgICAgICAgWzB4NWEsIDB4NTddLFxuICAgICAgICBbMHg2ZCwgMHg4MF0sXG4gICAgICAgIFsweDNkLCAweDM0XSxcbiAgICAgICAgWzB4MzksIDB4MDJdLFxuICAgICAgICBbMHgzNSwgMHg4OF0sXG4gICAgICAgIFsweDIyLCAweDBhXSxcbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHgzNCwgMHhhMF0sXG4gICAgICAgIFsweDA2LCAweDAyXSxcbiAgICAgICAgWzB4MGQsIDB4YjddLFxuICAgICAgICBbMHgwZSwgMHgwMV0sXG5cbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwNF0sXG4gICAgICAgIFsweGMwLCAweGM4XSxcbiAgICAgICAgWzB4YzEsIDB4OTZdLFxuICAgICAgICBbMHg4NiwgMHgzZF0sXG4gICAgICAgIFsweDUwLCAweDAwXSxcbiAgICAgICAgWzB4NTEsIDB4OTBdLFxuICAgICAgICBbMHg1MiwgMHgyY10sXG4gICAgICAgIFsweDUzLCAweDAwXSxcbiAgICAgICAgWzB4NTQsIDB4MDBdLFxuICAgICAgICBbMHg1NSwgMHg4OF0sXG4gICAgICAgIFsweDU3LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4NDBdLFxuICAgICAgICBbMHg1YiwgMHhmMF0sXG4gICAgICAgIFsweDVjLCAweDAxXSxcbiAgICAgICAgWzB4ZDMsIDB4MDJdLFxuICAgICAgICBbMHhlMCwgMHgwMF0sXG5cbiAgICAgICAgWzB4ZmYsIDB4ZmZdLFxuICAgICAgXSxcblxuICAgICAgT1YyNjQwXzE2MDB4MTIwMF9KUEVHOiBbXG4gICAgICAgIFsweGZmLCAweDAxXSxcbiAgICAgICAgWzB4MTEsIDB4MDFdLFxuICAgICAgICBbMHgxMiwgMHgwMF0sIC8vIEJpdFs2OjRdOiBSZXNvbHV0aW9uIHNlbGVjdGlvbi8vMHgwMlxuICAgICAgICBbMHgxNywgMHgxMV0sIC8vIEhSRUZTVFsxMDozXVxuICAgICAgICBbMHgxOCwgMHg3NV0sIC8vIEhSRUZFTkRbMTA6M11cbiAgICAgICAgWzB4MzIsIDB4MzZdLCAvLyBCaXRbNTozXTogSFJFRkVORFsyOjBdOyBCaXRbMjowXTogSFJFRlNUWzI6MF1cbiAgICAgICAgWzB4MTksIDB4MDFdLCAvLyBWU1RSVFs5OjJdXG4gICAgICAgIFsweDFhLCAweDk3XSwgLy8gVkVORFs5OjJdXG4gICAgICAgIFsweDAzLCAweDBmXSwgLy8gQml0WzM6Ml06IFZFTkRbMTowXTsgQml0WzE6MF06IFZTVFJUWzE6MF1cbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHg0ZiwgMHhiYl0sXG4gICAgICAgIFsweDUwLCAweDljXSxcbiAgICAgICAgWzB4NWEsIDB4NTddLFxuICAgICAgICBbMHg2ZCwgMHg4MF0sXG4gICAgICAgIFsweDNkLCAweDM0XSxcbiAgICAgICAgWzB4MzksIDB4MDJdLFxuICAgICAgICBbMHgzNSwgMHg4OF0sXG4gICAgICAgIFsweDIyLCAweDBhXSxcbiAgICAgICAgWzB4MzcsIDB4NDBdLFxuICAgICAgICBbMHgzNCwgMHhhMF0sXG4gICAgICAgIFsweDA2LCAweDAyXSxcbiAgICAgICAgWzB4MGQsIDB4YjddLFxuICAgICAgICBbMHgwZSwgMHgwMV0sXG5cbiAgICAgICAgWzB4ZmYsIDB4MDBdLFxuICAgICAgICBbMHhlMCwgMHgwNF0sXG4gICAgICAgIFsweGMwLCAweGM4XSxcbiAgICAgICAgWzB4YzEsIDB4OTZdLFxuICAgICAgICBbMHg4NiwgMHgzZF0sXG4gICAgICAgIFsweDUwLCAweDAwXSxcbiAgICAgICAgWzB4NTEsIDB4OTBdLFxuICAgICAgICBbMHg1MiwgMHgyY10sXG4gICAgICAgIFsweDUzLCAweDAwXSxcbiAgICAgICAgWzB4NTQsIDB4MDBdLFxuICAgICAgICBbMHg1NSwgMHg4OF0sXG4gICAgICAgIFsweDU3LCAweDAwXSxcbiAgICAgICAgWzB4NWEsIDB4OTBdLFxuICAgICAgICBbMHg1YiwgMHgyY10sXG4gICAgICAgIFsweDVjLCAweDA1XSwgLy8gYml0Mi0+MTtiaXRbMTowXS0+MVxuICAgICAgICBbMHhkMywgMHgwMl0sXG4gICAgICAgIFsweGUwLCAweDAwXSxcblxuICAgICAgICBbMHhmZiwgMHhmZl0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCBcIjV2XCIpO1xuXG4gICAgdGhpcy5pb19jcyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmNzKTtcbiAgICB0aGlzLmlvX2NzLm91dHB1dCh0cnVlKTtcblxuICAgIG9ibml6LndhaXQoMTAwKTtcblxuICAgIHRoaXMuc2Vuc29yX2FkZHIgPSAweDMwOyAvLyBpMmNcblxuICAgIHRoaXMucGFyYW1zLm1vZHVsZV92ZXJzaW9uID0gdGhpcy5wYXJhbXMubW9kdWxlX3ZlcnNpb24gfHwgMDtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gdGhpcy5wYXJhbXMubW9kZSB8fCBcIm1hc3RlclwiO1xuICAgIHRoaXMucGFyYW1zLmRyaXZlID0gdGhpcy5wYXJhbXMuc3BpX2RyaXZlIHx8IFwiM3ZcIjtcbiAgICB0aGlzLnBhcmFtcy5mcmVxdWVuY3kgPSB0aGlzLnBhcmFtcy5zcGlfZnJlcXVlbmN5IHx8IDQgKiAxMDAwICogMTAwMDtcbiAgICB0aGlzLnBhcmFtcy5jbGsgPSB0aGlzLnBhcmFtcy5zY2xrO1xuICAgIHRoaXMuc3BpID0gdGhpcy5vYm5pei5nZXRTcGlXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcblxuICAgIHRoaXMucGFyYW1zLnNkYSA9IHRoaXMucGFyYW1zLnNkYTtcbiAgICB0aGlzLnBhcmFtcy5zY2wgPSB0aGlzLnBhcmFtcy5zY2w7XG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSB0aGlzLnBhcmFtcy5jbG9jayB8fCAxMDAgKiAxMDAwO1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSBcIm1hc3RlclwiO1xuICAgIHRoaXMucGFyYW1zLnB1bGwgPSBcIjV2XCI7XG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgfVxuXG4gIHB1YmxpYyBzcGlfd3JpdGUoYWRkcjogYW55LCBieXRlRGF0YTogYW55KSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gW107XG4gICAgZGF0YS5wdXNoKGFkZHIpO1xuICAgIGRhdGEucHVzaChieXRlRGF0YSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuc3BpLndyaXRlKGRhdGEpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KHRydWUpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNwaV9yZWFkV2FpdChhZGRyOiBhbnkpIHtcbiAgICBjb25zdCBkYXRhOiBhbnkgPSBbXTtcbiAgICBkYXRhLnB1c2goYWRkcik7XG4gICAgZGF0YS5wdXNoKDB4MDApO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KGZhbHNlKTtcbiAgICBjb25zdCByZWN2OiBhbnkgPSBhd2FpdCB0aGlzLnNwaS53cml0ZVdhaXQoZGF0YSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQodHJ1ZSk7XG4gICAgcmV0dXJuIHJlY3ZbMV07XG4gIH1cblxuICBwdWJsaWMgaTJjX2J5dGVfd3JpdGUoYWRkcjogYW55LCBieXRlRGF0YTogYW55KSB7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5zZW5zb3JfYWRkciwgW2FkZHIsIGJ5dGVEYXRhXSk7XG4gIH1cblxuICBwdWJsaWMgaTJjX3JlZ3Nfd3JpdGUocmVnczogYW55KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmkyYy53cml0ZSh0aGlzLnNlbnNvcl9hZGRyLCByZWdzW2ldKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3BpX3dyaXRlX3JlZyhhZGRyOiBhbnksIGJ5dGVEYXRhOiBhbnkpIHtcbiAgICB0aGlzLnNwaV93cml0ZShhZGRyIHwgMHg4MCwgYnl0ZURhdGEpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNwaV9yZWFkX3JlZ1dhaXQoYWRkcjogYW55KSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuc3BpX3JlYWRXYWl0KGFkZHIgJiAweDdmKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzcGlfcGluZ3BvbmdXYWl0KCkge1xuICAgIGNvbnN0IHRlc3RWYWw6IGFueSA9IDB4NTU7XG4gICAgdGhpcy5zcGlfd3JpdGVfcmVnKHRoaXMucmVncy5BUkRVQ0hJUF9URVNUMSwgdGVzdFZhbCk7XG4gICAgY29uc3QgdmFsOiBhbnkgPSBhd2FpdCB0aGlzLnNwaV9yZWFkX3JlZ1dhaXQodGhpcy5yZWdzLkFSRFVDSElQX1RFU1QxKTtcbiAgICBpZiAodmFsICE9PSB0ZXN0VmFsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzcGkgYnVzIGZhaWxcIik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldE1vZGUobW9kZTogYW55KSB7XG4gICAgY29uc3QgbW9kZXM6IGFueSA9IHtcbiAgICAgIE1DVTJMQ0Q6IDB4MDAsXG4gICAgICBDQU0yTENEOiAweDAxLFxuICAgICAgTENEMk1DVTogMHgwMixcbiAgICB9O1xuICAgIGlmICh0eXBlb2YgbW9kZXNbbW9kZV0gIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gbW9kZS4gb3B0aW9ucyBhcmUgXCIgKyBtb2Rlcyk7XG4gICAgfVxuICAgIHRoaXMuc3BpX3dyaXRlX3JlZyh0aGlzLnJlZ3MuQVJEVUNISVBfTU9ERSwgbW9kZXNbbW9kZV0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoaXBJZFdhaXQoKSB7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5zZW5zb3JfYWRkciwgWzB4MGFdKTtcbiAgICBjb25zdCB2YWwwOiBhbnkgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLnNlbnNvcl9hZGRyLCAxKTtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLnNlbnNvcl9hZGRyLCBbMHgwYl0pO1xuICAgIGNvbnN0IHZhbDE6IGFueSA9IGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuc2Vuc29yX2FkZHIsIDEpO1xuICAgIHJldHVybiAodmFsMFswXSA8PCA4KSArIHZhbDFbMF07XG4gIH1cblxuICBwdWJsaWMgaW5pdCgpIHtcbiAgICB0aGlzLmkyY19ieXRlX3dyaXRlKDB4ZmYsIDB4MDEpO1xuICAgIHRoaXMuaTJjX2J5dGVfd3JpdGUoMHgxMiwgMHg4MCk7XG4gICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG5cbiAgICB0aGlzLmkyY19yZWdzX3dyaXRlKHRoaXMuY29uZmlncy5PVjI2NDBfSlBFR19JTklUKTtcbiAgICB0aGlzLmkyY19yZWdzX3dyaXRlKHRoaXMuY29uZmlncy5PVjI2NDBfWVVWNDIyKTtcbiAgICB0aGlzLmkyY19yZWdzX3dyaXRlKHRoaXMuY29uZmlncy5PVjI2NDBfSlBFRyk7XG4gICAgdGhpcy5pMmNfYnl0ZV93cml0ZSgweGZmLCAweDAxKTtcbiAgICB0aGlzLmkyY19ieXRlX3dyaXRlKDB4MTUsIDB4MDApO1xuICAgIHRoaXMuc2V0U2l6ZShcIjMyMHgyNDBcIik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc3RhcnR1cFdhaXQoKSB7XG4gICAgYXdhaXQgdGhpcy5zcGlfcGluZ3BvbmdXYWl0KCk7XG4gICAgdGhpcy5zZXRNb2RlKFwiTUNVMkxDRFwiKTtcbiAgICBjb25zdCBjaGlwaWQ6IGFueSA9IGF3YWl0IHRoaXMuZ2V0Q2hpcElkV2FpdCgpO1xuICAgIGlmIChjaGlwaWQgIT09IDB4MjY0MiAmJiBjaGlwaWQgIT09IDB4MjY0MSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBjaGlwIFwiICsgY2hpcGlkKTtcbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdGFrZVdhaXQoc2l6ZTogYW55KSB7XG4gICAgaWYgKHR5cGVvZiBzaXplID09PSBcInN0cmluZ1wiICYmIHRoaXMuX3NpemUgIT09IHNpemUpIHtcbiAgICAgIHRoaXMuc2V0U2l6ZShzaXplKTtcbiAgICAgIHRoaXMub2JuaXoud2FpdCgxMDAwKTtcbiAgICB9XG5cbiAgICB0aGlzLmZsdXNoRklGTygpO1xuICAgIHRoaXMuZmx1c2hGSUZPKCk7XG4gICAgdGhpcy5zdGFydENhcHR1cmUoKTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGF3YWl0IHRoaXMuaXNDYXB0dXJlRG9uZVdhaXQoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucmVhZEZJRk9XYWl0KCk7XG4gIH1cblxuICBwdWJsaWMgc2V0U2l6ZShzdHJpbmc6IGFueSkge1xuICAgIGlmICh0aGlzLl9zaXplID09PSBzdHJpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWFwOiBhbnkgPSB7XG4gICAgICBcIjE2MHgxMjBcIjogdGhpcy5jb25maWdzLk9WMjY0MF8xNjB4MTIwX0pQRUcsXG4gICAgICBcIjE3NngxNDRcIjogdGhpcy5jb25maWdzLk9WMjY0MF8xNzZ4MTQ0X0pQRUcsXG4gICAgICBcIjMyMHgyNDBcIjogdGhpcy5jb25maWdzLk9WMjY0MF8zMjB4MjQwX0pQRUcsXG4gICAgICBcIjM1MngyODhcIjogdGhpcy5jb25maWdzLk9WMjY0MF8zNTJ4Mjg4X0pQRUcsXG4gICAgICBcIjY0MHg0ODBcIjogdGhpcy5jb25maWdzLk9WMjY0MF82NDB4NDgwX0pQRUcsXG4gICAgICBcIjgwMHg2MDBcIjogdGhpcy5jb25maWdzLk9WMjY0MF84MDB4NjAwX0pQRUcsXG4gICAgICBcIjEwMjR4NzY4XCI6IHRoaXMuY29uZmlncy5PVjI2NDBfMTAyNHg3NjhfSlBFRyxcbiAgICAgIFwiMTI4MHg5NjBcIjogdGhpcy5jb25maWdzLk9WMjY0MF8xMjgweDk2MF9KUEVHLFxuICAgICAgXCIxNjAweDEyMDBcIjogdGhpcy5jb25maWdzLk9WMjY0MF8xNjAweDEyMDBfSlBFRyxcbiAgICB9O1xuICAgIGlmIChtYXBbc3RyaW5nXSkge1xuICAgICAgdGhpcy5fc2l6ZSA9IHN0cmluZztcbiAgICAgIHRoaXMuaTJjX3JlZ3Nfd3JpdGUobWFwW3N0cmluZ10pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bnN1cHBvcnRlZCBzaXplIG9wdGlvbnMgYXJlIFwiICsgT2JqZWN0LmtleXMobWFwKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZUZJRk8oZGF0YTogYW55KSB7XG4gICAgLy8gIEZJRk9fQ0xFQVJfTUFTSyAgICBcdFx0MHgwMVxuICAgIC8vICBGSUZPX1NUQVJUX01BU0sgICAgXHRcdDB4MDJcbiAgICAvLyAgRklGT19SRFBUUl9SU1RfTUFTSyAgICAgMHgxMFxuICAgIC8vICBGSUZPX1dSUFRSX1JTVF9NQVNLICAgICAweDIwXG4gICAgdGhpcy5zcGlfd3JpdGVfcmVnKHRoaXMucmVncy5BUkRVQ0hJUF9GSUZPLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBmbHVzaEZJRk8oKSB7XG4gICAgdGhpcy5zcGlfd3JpdGVfcmVnKHRoaXMucmVncy5BUkRVQ0hJUF9GSUZPLCAweDAxKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZWFkRklGT0xlbmd0aFdhaXQoKSB7XG4gICAgY29uc3QgbGVuMTogYW55ID0gYXdhaXQgdGhpcy5zcGlfcmVhZF9yZWdXYWl0KHRoaXMucmVncy5GSUZPX1NJWkUxKTtcbiAgICBjb25zdCBsZW4yOiBhbnkgPSBhd2FpdCB0aGlzLnNwaV9yZWFkX3JlZ1dhaXQodGhpcy5yZWdzLkZJRk9fU0laRTIpO1xuICAgIGNvbnN0IGxlbjM6IGFueSA9IChhd2FpdCB0aGlzLnNwaV9yZWFkX3JlZ1dhaXQodGhpcy5yZWdzLkZJRk9fU0laRTMpKSAmIDB4MDc7XG4gICAgcmV0dXJuICgobGVuMyA8PCAxNikgfCAobGVuMiA8PCA4KSB8IGxlbjEpICYgMHgwN2ZmZmY7XG4gIH1cblxuICBwdWJsaWMgc3RhcnRDYXB0dXJlKCkge1xuICAgIHRoaXMuc3BpX3dyaXRlX3JlZyh0aGlzLnJlZ3MuQVJEVUNISVBfRklGTywgMHgwMik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaXNDYXB0dXJlRG9uZVdhaXQoKSB7XG4gICAgY29uc3QgQ0FQX0RPTkVfTUFTSzogYW55ID0gMHgwODtcbiAgICBjb25zdCB2YWw6IGFueSA9IGF3YWl0IHRoaXMuc3BpX3JlYWRfcmVnV2FpdCh0aGlzLnJlZ3MuQVJEVUNISVBfVFJJRyk7XG4gICAgcmV0dXJuIHZhbCAmIENBUF9ET05FX01BU0sgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVhZEZJRk9XYWl0KCkge1xuICAgIC8vIGdldCBsZW5ndGggb2YgaW1hZ2UgZGF0YVxuICAgIGNvbnN0IGxlbmd0aDogYW55ID0gYXdhaXQgdGhpcy5yZWFkRklGT0xlbmd0aFdhaXQoKTtcblxuICAgIC8vIHN0YXJ0IGJ1c3RcbiAgICB0aGlzLmlvX2NzLm91dHB1dChmYWxzZSk7XG4gICAgdGhpcy5zcGkud3JpdGUoW3RoaXMucmVncy5CVVJTVF9GSUZPX1JFQURdKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5tb2R1bGVfdmVyc2lvbiA9PT0gMCkge1xuICAgICAgdGhpcy5zcGkud3JpdGUoWzB4ZmZdKTsgLy8gZHVtbXkgcmVhZFxuICAgIH1cblxuICAgIGNvbnN0IGJ1ZjogYW55ID0gW107XG5cbiAgICB3aGlsZSAoYnVmLmxlbmd0aCA8IGxlbmd0aCkge1xuICAgICAgbGV0IG11c3RSZWFkOiBhbnkgPSBsZW5ndGggLSBidWYubGVuZ3RoO1xuICAgICAgaWYgKG11c3RSZWFkID4gMTAyNCkge1xuICAgICAgICBtdXN0UmVhZCA9IDEwMjQ7XG4gICAgICB9XG4gICAgICBjb25zdCBhcnI6IGFueSA9IG5ldyBBcnJheShtdXN0UmVhZCk7XG4gICAgICBhcnIuZmlsbCgwKTtcbiAgICAgIGNvbnN0IHNsaWNlZDogYW55ID0gYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KGFycik7XG4gICAgICBidWYucHVzaCguLi5zbGljZWQpO1xuICAgIH1cbiAgICAvLyBlbmQgYnVyc3RcbiAgICB0aGlzLmlvX2NzLm91dHB1dCh0cnVlKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBwdWJsaWMgYXJyYXlUb0Jhc2U2NChhcnJheTogYW55KSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGFycmF5KS50b1N0cmluZyhcImJhc2U2NFwiKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcmR1Q0FNTWluaTtcbiJdfQ==
