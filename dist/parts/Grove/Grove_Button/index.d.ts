export = Grove_Button;
declare class Grove_Button {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    onChangeForStateWait: () => void;
    wired(obniz: any): void;
    io_signal: any;
    io_vcc: any;
    io_supply: any;
    isPressedWait(): Promise<any>;
    stateWait(isPressed: any): Promise<any>;
}
