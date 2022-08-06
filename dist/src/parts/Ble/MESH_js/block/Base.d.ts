export declare class Base {
    onBatteryLevel: ((battery: number) => void) | null;
    onStatusButtonPressed: (() => void) | null;
    readonly UUIDS: {
        readonly SERVICE_ID: "72c90001-57a9-4d40-b746-534e22ec9f9e";
        readonly CHARACTERISTICS: {
            readonly INDICATE: "72c90005-57a9-4d40-b746-534e22ec9f9e";
            readonly NOTIFY: "72c90003-57a9-4d40-b746-534e22ec9f9e";
            readonly WRITE: "72c90004-57a9-4d40-b746-534e22ec9f9e";
            readonly WRITE_WO_RESPONSE: "72c90002-57a9-4d40-b746-534e22ec9f9e";
        };
    };
    private readonly FEATURE_COMMAND_;
    private readonly MESSAGE_TYPE_ID_INDEX;
    private readonly EVENT_TYPE_ID_INDEX;
    private readonly VERSION_MAJOR_INDEX_;
    private readonly VERSION_MINOR_INDEX_;
    private readonly VERSION_RELEASE_INDEX_;
    private readonly BATTERY_INDEX_;
    private readonly MESSAGE_TYPE_ID_VALUE;
    private readonly EVENT_TYPE_ID_VALUE;
    private readonly INDICATE_LENGTH;
    private versionMajor_;
    private versionMinor_;
    private versionRelease_;
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
    protected complemnt(val: number): number;
    protected invcomplemnt(val: number): number;
    private updateBattery_;
    private updateStatusButton_;
    private checkVersion_;
}
