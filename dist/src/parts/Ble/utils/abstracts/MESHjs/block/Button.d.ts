import { Base } from './Base';
export declare class Button extends Base {
    /**
     * Single pressed event
     */
    onSinglePressed: (() => void) | null;
    /**
     * Long pressed event
     */
    onLongPressed: (() => void) | null;
    /**
     * Double pressed event
     */
    onDoublePressed: (() => void) | null;
    private readonly DATA_LENGTH_;
    private readonly TYPE_INDEX_;
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private readonly TYPE_;
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name: string | null, opt_serialnumber?: string): boolean;
    /**
     * Parse data that received from MESH block, and emit event
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
}
