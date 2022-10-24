import { Base } from './Base';
export declare class Move extends Base {
    /**
     * Tapped event
     */
    onTapped: ((accele: Move['accele']) => void) | null;
    /**
     * Shaked event
     */
    onShaked: ((accele: Move['accele']) => void) | null;
    /**
     * Flipped event
     */
    onFlipped: ((accele: Move['accele']) => void) | null;
    /**
     * Orientation changed event
     */
    onOrientationChanged: ((face: number, accele: Move['accele']) => void) | null;
    protected accele: {
        x: number;
        y: number;
        z: number;
    };
    private readonly TYPE_INDEX_;
    private readonly MESSAGE_TYPE_ID_;
    private readonly DATA_LENGTH_;
    private readonly TAP_EVENT_ID_;
    private readonly SHAKE_EVENT_ID_;
    private readonly FLIP_EVENT_ID_;
    private readonly ORIENTATION_EVENT_ID_;
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
