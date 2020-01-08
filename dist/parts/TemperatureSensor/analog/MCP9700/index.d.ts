export = MCP9700;
declare class MCP9700 {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
