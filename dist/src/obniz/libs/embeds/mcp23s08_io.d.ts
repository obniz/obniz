import { Obniz } from '../../Obniz';
export declare class MCP23S08_IO {
    chip: any;
    id: any;
    direction: boolean;
    value: boolean;
    constructor(chip: any, id: any);
    output(value: any): void;
    outputWait(value: any): Promise<void>;
    inputWait(obniz: Obniz): Promise<any>;
}
