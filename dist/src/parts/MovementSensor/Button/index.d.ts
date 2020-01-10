declare class Button {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    onChangeForStateWait: any;
    io_signal: any;
    params: any;
    io_supply: any;
    isPressed: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
    isPressedWait(): Promise<boolean>;
    stateWait(isPressed: any): Promise<unknown>;
}
export default Button;
