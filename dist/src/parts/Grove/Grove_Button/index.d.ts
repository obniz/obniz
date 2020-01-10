declare class Grove_Button {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    onChangeForStateWait: any;
    io_signal: any;
    params: any;
    io_vcc: any;
    io_supply: any;
    isPressed: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
    isPressedWait(): Promise<any>;
    stateWait(isPressed: any): Promise<{}>;
}
export default Grove_Button;
