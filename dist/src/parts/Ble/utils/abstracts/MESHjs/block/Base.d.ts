export declare class Base {
    /**
     * Battery level event
     */
    onBatteryLevel: ((battery: number) => void) | null;
    /**
     * Status button pressed event
     */
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
    protected readonly MESSAGE_TYPE_ID_INDEX: 0;
    protected readonly EVENT_TYPE_ID_INDEX: 1;
    private readonly FEATURE_COMMAND_;
    private readonly MESSAGE_TYPE_ID_VALUE_;
    private readonly INDICATE_EVENT_TYPE_ID_VALUE_;
    private readonly INDICATE_LENGTH_;
    private readonly INDICATE_VERSION_MAJOR_INDEX_;
    private readonly INDICATE_VERSION_MINOR_INDEX_;
    private readonly INDICATE_VERSION_RELEASE_INDEX_;
    private readonly INDICATE_BATTERY_INDEX_;
    private readonly REGULARLY_EVENT_TYPE_ID_VALUE_;
    private readonly REGULARLY_LENGTH_;
    private readonly REGULARLY_BATTERY_INDEX_;
    private readonly STATUSBUTTON_PRESSED_EVENT_TYPE_ID_VALUE_;
    private readonly STATUSBUTTON_PRESSED_LENGTH_;
    private readonly STATUSBAR_LED_EVENT_TYPE_ID_VALUE_;
    private versionMajor_;
    private versionMinor_;
    private versionRelease_;
    private battery_;
    /**
     * Get command of feature behavior
     */
    get featureCommand(): number[];
    /**
     * Get battery level
     */
    get battery(): number;
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name: string | null, opt_serialnumber?: string): boolean;
    /**
     * Set result of indicate
     *
     * @param data
     * @returns void
     */
    indicate(data: number[]): void;
    /**
     * notify
     *
     * @param data
     */
    notify(data: number[]): void;
    /**
     * Create command of statusbar LED
     *
     * @param power
     * @param red
     * @param green
     * @param blue
     * @returns command
     */
    createStatusbarLedCommand(power: boolean, red: boolean, green: boolean, blue: boolean): number[];
    /**
     * Check software version of MESH block
     *
     * @returns
     */
    checkVersion(): boolean;
    protected checkSum(command: number[]): number;
    protected checkRange(target: number, min: number, max: number, name: string): boolean;
    protected complemnt(val: number): number;
    protected invcomplemnt(val: number): number;
    private updateBattery_;
    private updateStatusButton_;
}
