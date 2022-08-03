export declare class Base {
    onBatteryLevel: ((battery: number) => void) | null;
    onStatusButtonPressed: (() => void) | null;
    readonly UUIDS: {
        readonly SERVICE_ID: "72C90001-57A9-4D40-B746-534E22EC9F9E";
        readonly CHARACTERISTICS: {
            readonly INDICATE: "72c90005-57a9-4d40-b746-534e22ec9f9e";
            readonly NOTIFY: "72c90003-57a9-4d40-b746-534e22ec9f9e";
            readonly WRITE: "72c90004-57a9-4d40-b746-534e22ec9f9e";
            readonly WRITE_WO_RESPONSE: "72c90002-57a9-4d40-b746-534e22ec9f9e";
        };
    };
    private readonly FEATURE_COMMAND_;
    private battery_;
    get featureCommand(): number[];
    get battery(): number;
    /**
     * indicate
     *
     * @param data
     * @returns
     */
    indicate(data: number[]): void;
    /**
     * notify
     *
     * @param data
     */
    notify(data: number[]): void;
    protected checkSum(command: number[]): number;
    protected checkRange(target: number, min: number, max: number, name: string): boolean;
    private updateBattery_;
    private updateStatusButton_;
    private checkVersion_;
}
