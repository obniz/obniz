export declare class MESH_js {
    private _battery;
    onBattery: ((battery: number) => void) | null;
    onStatusButtonPressed: (() => void) | null;
    feature(): number[];
    get battery(): number;
    notify(data: number[]): void;
    printData(message: string): void;
    protected checkSum(command: number[]): number;
    protected errorMessage(message: string): void;
    protected errorOutOfRange(message: string): void;
    private updateBattery;
    private updateStatusButton;
}
export declare class MESH_BU extends MESH_js {
    private type;
    onSinglePressed: (() => void) | null;
    onLongPressed: (() => void) | null;
    onDoublePressed: (() => void) | null;
    notify(data: number[]): void;
}
export declare class MESH_LE extends MESH_js {
    private _pattern;
    notify(data: number[]): void;
    lightup(red: number, green: number, blue: number, time: number, cycle_on: number, cycle_off: number, pattern: number): number[];
}
export declare class MESH_AC extends MESH_js {
    private accele;
    private face;
    onTapped: ((accele: MESH_AC['accele']) => void) | null;
    onShaked: ((accele: MESH_AC['accele']) => void) | null;
    onFlipped: ((accele: MESH_AC['accele']) => void) | null;
    onDirection: ((face: number, accele: MESH_AC['accele']) => void) | null;
    notify(data: number[]): void;
    getAccele(): {
        x: number;
        y: number;
        z: number;
    };
    getFace(): number;
    printData(): void;
    private updateFace;
    private updateAccele;
}
export declare class MESH_PA extends MESH_js {
    notify(data: number[]): void;
}
export declare class MESH_TH extends MESH_js {
    notify(data: number[]): void;
    setMode(temperature_upper: number, temperature_bottom: number, temperature_condition: number, humidity_upper: number, humidity_bottom: number, humidity_condision: number, type: number): number[];
}
export declare class MESH_MD extends MESH_js {
    notify(data: number[]): void;
    setMode(requestid: number, mode: number, time1: number, time2: number): number[];
}
