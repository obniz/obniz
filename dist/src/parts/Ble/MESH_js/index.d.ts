export declare class MESH_js {
    readonly UUIDS: {
        readonly serviceId: "72C90001-57A9-4D40-B746-534E22EC9F9E";
        readonly characteristics: {
            readonly Indicate: "72c90005-57a9-4d40-b746-534e22ec9f9e";
            readonly Notify: "72c90003-57a9-4d40-b746-534e22ec9f9e";
            readonly Write: "72c90004-57a9-4d40-b746-534e22ec9f9e";
            readonly WriteWOResponse: "72c90002-57a9-4d40-b746-534e22ec9f9e";
        };
    };
    onBattery: ((battery: number) => void) | null;
    onStatusButtonPressed: (() => void) | null;
    private readonly _feature_command;
    private _battery;
    get feature(): number[];
    get battery(): number;
    indicate(data: number[]): void;
    notify(data: number[]): void;
    printData(message: string): void;
    protected checkSum(command: number[]): number;
    protected errorMessage(message: string): void;
    protected errorOutOfRange(message: string): void;
    private _updateBattery;
    private _updateStatusButton;
}
