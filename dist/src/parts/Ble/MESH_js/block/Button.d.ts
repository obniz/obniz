import { Base } from './Base';
export declare class Button extends Base {
    onSinglePressed: (() => void) | null;
    onLongPressed: (() => void) | null;
    onDoublePressed: (() => void) | null;
    private readonly DATA_LENGTH_;
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private readonly TYPE_;
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
}
