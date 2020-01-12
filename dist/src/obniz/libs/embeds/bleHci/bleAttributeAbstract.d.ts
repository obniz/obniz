declare class BleAttributeAbstract {
    uuid: any;
    parent: any;
    children: any;
    isRemote: any;
    discoverdOnRemote: any;
    data: any;
    emitter: any;
    constructor(params: any);
    setFunctions(): void;
    get childrenClass(): any;
    get childrenName(): string | null;
    get parentName(): string | null;
    addChild(child: any): any;
    getChild(uuid: any): any;
    toJSON(): any;
    /**
     * WS COMMANDS
     */
    read(): void;
    write(data: any, needResponse?: boolean): void;
    writeNumber(val: any, needResponse?: any): void;
    writeText(str: any, needResponse?: any): void;
    readWait(): Promise<unknown>;
    writeWait(data: any, needResponse: any): Promise<unknown>;
    writeTextWait(data: any): Promise<unknown>;
    writeNumberWait(data: any): Promise<unknown>;
    readFromRemoteWait(): Promise<unknown>;
    writeFromRemoteWait(): Promise<unknown>;
    /**
     * CALLBACKS
     */
    onwrite(result: any): void;
    onread(data: any): void;
    onwritefromremote(address: any, data: any): void;
    onreadfromremote(address: any): void;
    onerror(err: any): void;
    notifyFromServer(notifyName: any, params: any): void;
}
export default BleAttributeAbstract;
