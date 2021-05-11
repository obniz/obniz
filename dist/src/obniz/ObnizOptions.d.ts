/**
 * @packageDocumentation
 * @module ObnizCore
 */
export interface ObnizOptions {
    /**
     * compressed format. not json. It set to false, then local_connect can't be used
     *
     * @default true
     */
    binary?: boolean;
    /**
     * obniz.js try to connect locally after cloud api established if possible. true will be ignored when binary was set to false
     *
     * @default true
     */
    local_connect?: boolean;
    /**
     * In HTML, online status and debug info will be showed in DOM which has this id.
     *
     * @default 'obniz-debug'
     */
    debug_dom_id?: string;
    /**
     * obniz.js automatically connect to cloud API after instantiate soon. falset to disable it. The interval of auto connect become longer.
     *
     * @default true
     */
    auto_connect?: boolean;
    /**
     * If you specified access_token to your obniz Board. set it's key to this parameter.
     *
     * @default null
     */
    access_token?: string | null;
    /**
     * @ignore
     */
    obniz_server?: string;
    /**
     * With 'true', obniz cloud will reset your obniz Board after all websocket connection to an obniz Board was closed.
     *
     * @default true
     */
    reset_obniz_on_ws_disconnection?: boolean;
    /**
     * With 'true', create input interface of obniz id If non-obniz Id string was passed on create Obniz instance. (HTML only)
     *
     * @default true
     */
    obnizid_dialog?: boolean;
}
