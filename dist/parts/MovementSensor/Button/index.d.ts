export = Button;
declare class Button {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    onChangeForStateWait: () => void;
    wired(obniz: any): void;
    io_signal: any;
    io_supply: any;
    isPressedWait(): Promise<boolean>;
    stateWait(isPressed: any): Promise<any>;
}
