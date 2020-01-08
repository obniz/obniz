export = MCP9701;
declare class MCP9701 {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
