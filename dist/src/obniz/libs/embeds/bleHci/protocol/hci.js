"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hci = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../ObnizError");
const bleHelper_1 = __importDefault(require("../bleHelper"));
/* eslint rulesdir/non-ascii: 0 */
// eslint-disable-next-line @typescript-eslint/no-namespace
var COMMANDS;
(function (COMMANDS) {
    COMMANDS.HCI_COMMAND_PKT = 0x01;
    COMMANDS.HCI_ACLDATA_PKT = 0x02;
    COMMANDS.HCI_EVENT_PKT = 0x04;
    COMMANDS.ACL_START_NO_FLUSH = 0x00;
    COMMANDS.ACL_CONT = 0x01;
    COMMANDS.ACL_START = 0x02;
    COMMANDS.EVT_DISCONN_COMPLETE = 0x05;
    COMMANDS.EVT_ENCRYPT_CHANGE = 0x08;
    COMMANDS.EVT_CMD_COMPLETE = 0x0e;
    COMMANDS.EVT_CMD_STATUS = 0x0f;
    COMMANDS.EVT_NUMBER_OF_COMPLETED_PACKETS = 0x13;
    COMMANDS.EVT_ENCRYPTION_KEY_REFRESH_COMPLETE = 0x30;
    COMMANDS.EVT_LE_META_EVENT = 0x3e;
    COMMANDS.EVT_LE_CONN_COMPLETE = 0x01;
    COMMANDS.EVT_LE_ADVERTISING_REPORT = 0x02;
    COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE = 0x03;
    COMMANDS.EVT_LE_ENHANCED_CONNECTION_COMPLETE = 0x0a;
    COMMANDS.EVT_LE_PHY_UPDATE_COMPLETE = 0x0c; // LE PHY アップデート完了イベント
    COMMANDS.EVT_LE_EXTENDED_ADVERTISING_REPORT = 0x0d; // LE拡張広告レポートイベント
    COMMANDS.EVT_LE_PERIODIC_ADVERTISING_SYNC_ESTABLISHED = 0x0e; // LE 定期的広告同期確立イベント
    COMMANDS.EVT_LE_PERIODIC_ADVERTISING_REPORT_EVENT = 0x0f; // LE定期広告レポートイベント
    COMMANDS.EVT_LE_PERIODIC_ADVERTISING_SYNC_LOST_EVENT = 0x10; // 周期的広告パケットをタイムアウト時間内に受信しなかった
    COMMANDS.EVT_LE_SCAN_TIMEOUT_EVENT = 0x11; // LEスキャンタイムアウトイベント
    COMMANDS.EVT_LE_ADVERTISING_SET_TERMINATED_EVENT = 0x12; // LE 広告セット終了イベント
    COMMANDS.EVT_LE_SCAN_REQUEST_RECEIVED_EVENT = 0x13; // LE スキャン要求受信イベント
    COMMANDS.OGF_LINK_CTL = 0x01;
    COMMANDS.OCF_DISCONNECT = 0x0006;
    COMMANDS.OGF_LINK_POLICY = 0x02;
    COMMANDS.OGF_WRITE_DEFAULT_LINK_POLICY_SETTINGS = 0x0f;
    COMMANDS.OGF_HOST_CTL = 0x03;
    COMMANDS.OCF_SET_EVENT_MASK = 0x0001;
    COMMANDS.OCF_RESET = 0x0003;
    COMMANDS.OCF_READ_LOCAL_NAME = 0x0014;
    COMMANDS.OCF_WRITE_PAGE_TIMEOUT = 0x0018;
    COMMANDS.OCF_WRITE_CLASS_OF_DEVICE = 0x0024;
    COMMANDS.OCF_WRITE_INQUIRY_SCAN_TYPE = 0x0043;
    COMMANDS.OCF_WRITE_INQUIRY_MODE = 0x0045;
    COMMANDS.OCF_WRITE_PAGE_SCAN_TYPE = 0x0047;
    COMMANDS.OCF_WRITE_SIMPLE_PAIRING_MODE = 0x0056;
    COMMANDS.OCF_SET_EVENT_MASK_PAGE_2 = 0x0063;
    COMMANDS.OCF_READ_LE_HOST_SUPPORTED = 0x006c;
    COMMANDS.OCF_WRITE_LE_HOST_SUPPORTED = 0x006d;
    COMMANDS.OGF_INFO_PARAM = 0x04;
    COMMANDS.OCF_READ_LOCAL_VERSION = 0x0001;
    COMMANDS.OCF_READ_LOCAL_SUPPORTED_COMMANDS = 0x0002;
    COMMANDS.OCF_READ_LOCAL_SUPPORTED_FEATURES = 0x0003;
    COMMANDS.OCF_READ_LOCAL_EXTENDED_FEATURES = 0x0004;
    COMMANDS.OCF_READ_BUFFER_SIZE = 0x0005;
    COMMANDS.OCF_READ_BD_ADDR = 0x0009;
    COMMANDS.OGF_STATUS_PARAM = 0x05;
    COMMANDS.OCF_READ_RSSI = 0x0005;
    COMMANDS.OGF_LE_CTL = 0x08;
    COMMANDS.OCF_LE_SET_EVENT_MASK = 0x0001;
    COMMANDS.OCF_LE_READ_BUFFER_SIZE = 0x0002;
    COMMANDS.OCF_LE_READ_LOCAL_SUPPORTED_FEATURES = 0x0003;
    COMMANDS.OCF_LE_SET_RANDOM_ADDRESS = 0x0005;
    COMMANDS.OCF_LE_SET_ADVERTISING_PARAMETERS = 0x0006;
    COMMANDS.OCF_LE_READ_ADVERTISING_CHANNEL_TX_POWER = 0x0007;
    COMMANDS.OCF_LE_SET_ADVERTISING_DATA = 0x0008;
    COMMANDS.OCF_LE_SET_SCAN_RESPONSE_DATA = 0x0009;
    COMMANDS.OCF_LE_SET_ADVERTISE_ENABLE = 0x000a;
    COMMANDS.OCF_LE_SET_SCAN_PARAMETERS = 0x000b;
    COMMANDS.OCF_LE_SET_SCAN_ENABLE = 0x000c;
    COMMANDS.OCF_LE_CREATE_CONN = 0x000d;
    COMMANDS.OCF_LE_CREATE_CONN_CANCEL = 0x000e;
    COMMANDS.OCF_LE_READ_WHITE_LIST_SIZE = 0x000f;
    COMMANDS.OCF_LE_CLEAR_WHITE_LIST = 0x0010;
    COMMANDS.OCF_LE_CONN_UPDATE = 0x0013;
    COMMANDS.OCF_LE_ENCRYPT = 0x0017;
    COMMANDS.OCF_LE_RAND = 0x0018;
    COMMANDS.OCF_LE_START_ENCRYPTION = 0x0019;
    COMMANDS.OCF_LE_LTK_NEG_REPLY = 0x001b;
    COMMANDS.OCF_LE_READ_SUPPORTED_STATES = 0x001c;
    COMMANDS.OCF_LE_READ_SUGGESTED_DEFAULT_DATA_LENGTH = 0x0023;
    COMMANDS.OCF_LE_WRITE_SUGGESTED_DEFAULT_DATA_LENGTH = 0x0024;
    COMMANDS.OCF_LE_CLEAR_RESOLVING_LIST = 0x0029;
    COMMANDS.OCF_LE_READ_RESOLVING_LIST_SIZE = 0x002a;
    COMMANDS.OCF_LE_SET_RESOLVABLE_PRIVATE_ADDRESS_TIMEOUT = 0x002e;
    COMMANDS.OCF_LE_READ_MAXIMUM_DATA_LENGTH = 0x002f;
    COMMANDS.OCF_LE_READ_PHY = 0x0030;
    COMMANDS.OCF_LE_SET_DEFAULT_PHY = 0x0031;
    COMMANDS.OCF_LE_SET_PHY = 0x0032;
    COMMANDS.OCF_LE_SET_EXTENDED_ADVERTISING_PARAMETERS = 0x0036; // ExAdv
    COMMANDS.OCF_LE_SET_EXTENDED_ADVERTISING_DATA = 0x0037; // ExAdv
    COMMANDS.OCF_LE_SET_EXTENDED_SCAN_RESPONSE_DATA = 0x0038; // ExAdv
    COMMANDS.OCF_LE_SET_EXTENDED_ADVERTISING_ENABLE = 0x0039; // ExAdv
    COMMANDS.OCF_LE_READ_MAXIMUM_ADVERTISING_DATA_LENGTH = 0x003a;
    COMMANDS.OCF_LE_CLEAR_ADVERTISING_SETS = 0x003d; // ExAdv
    COMMANDS.OCF_LE_SET_PERIODIC_ADVERTISING_PARAMETERS = 0x003e;
    COMMANDS.OCF_LE_SET_PERIODIC_ADVERTISING_DATA = 0x003f;
    COMMANDS.OCF_LE_SET_PERIODIC_ADVERTISING_ENABLE = 0x0040;
    COMMANDS.OCF_LE_SET_EXTENDED_SCAN_PARAMETERS = 0x0041; // ExAdv
    COMMANDS.OCF_LE_SET_EXTENDED_SCAN_ENABLE = 0x0042; // ExAdv
    COMMANDS.OCF_LE_EXTENDED_CREATE_CONNECTION = 0x0043; // ExAdv
    COMMANDS.OCF_LE_PERIODIC_ADVERTISING_CREATE_SYNC = 0x0044;
    COMMANDS.OCF_LE_PERIODIC_ADVERTISING_CREATE_SYNC_CANCEL = 0x0045;
    COMMANDS.OCF_LE_PERIODIC_ADVERTISING_TERMINATE_SYNC = 0x0046;
    COMMANDS.OCF_LE_ADD_DEVICE_TO_PERIODIC_ADVERTISER_LIST = 0x0047;
    COMMANDS.OCF_LE_REMOVE_DEVICE_TO_PERIODIC_ADVERTISER_LIST = 0x0048;
    COMMANDS.OCF_LE_CLEAR_DEVICE_TO_PERIODIC_ADVERTISER_LIST = 0x0049;
    /* OGF_LINK_CTL : 0x01 */
    COMMANDS.DISCONNECT_CMD = COMMANDS.OCF_DISCONNECT | (COMMANDS.OGF_LINK_CTL << 10);
    /* OGF_LINK_POLICY: 0x02 */
    COMMANDS.WRITE_DEFAULT_LINK_POLICY_SETTINGS_CMD = COMMANDS.OGF_WRITE_DEFAULT_LINK_POLICY_SETTINGS | (COMMANDS.OGF_LINK_POLICY << 10);
    /* OGF_HOST_CTL : 0x03 */
    COMMANDS.SET_EVENT_MASK_CMD = COMMANDS.OCF_SET_EVENT_MASK | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.RESET_CMD = COMMANDS.OCF_RESET | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.READ_LOCAL_NAME_CMD = COMMANDS.OCF_READ_LOCAL_NAME | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_PAGE_TIMEOUT_CMD = COMMANDS.OCF_WRITE_PAGE_TIMEOUT | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_CLASS_OF_DEVICE_CMD = COMMANDS.OCF_WRITE_CLASS_OF_DEVICE | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_INQUIRY_SCAN_TYPE_CMD = COMMANDS.OCF_WRITE_INQUIRY_SCAN_TYPE | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_INQUIRY_MODE_CMD = COMMANDS.OCF_WRITE_INQUIRY_MODE | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_PAGE_SCAN_TYPE_CMD = COMMANDS.OCF_WRITE_PAGE_SCAN_TYPE | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_SIMPLE_PAIRING_MODE_CMD = COMMANDS.OCF_WRITE_SIMPLE_PAIRING_MODE | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.SET_EVENT_MASK_PAGE_2_CMD = COMMANDS.OCF_SET_EVENT_MASK_PAGE_2 | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.READ_LE_HOST_SUPPORTED_CMD = COMMANDS.OCF_READ_LE_HOST_SUPPORTED | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_LE_HOST_SUPPORTED_CMD = COMMANDS.OCF_WRITE_LE_HOST_SUPPORTED | (COMMANDS.OGF_HOST_CTL << 10);
    /* OGF_INFO_PARAM : 0x04 */
    COMMANDS.READ_LOCAL_VERSION_CMD = COMMANDS.OCF_READ_LOCAL_VERSION | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_LOCAL_SUPPORTED_COMMANDS_CMD = COMMANDS.OCF_READ_LOCAL_SUPPORTED_COMMANDS | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_LOCAL_SUPPORTED_FEATURES_CMD = COMMANDS.OCF_READ_LOCAL_SUPPORTED_FEATURES | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_LOCAL_EXTENDED_FEATURES_CMD = COMMANDS.OCF_READ_LOCAL_EXTENDED_FEATURES | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_BUFFER_SIZE_CMD = COMMANDS.OCF_READ_BUFFER_SIZE | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_BD_ADDR_CMD = COMMANDS.OCF_READ_BD_ADDR | (COMMANDS.OGF_INFO_PARAM << 10);
    /* OGF_STATUS_PARAM: 0x05 */
    COMMANDS.READ_RSSI_CMD = COMMANDS.OCF_READ_RSSI | (COMMANDS.OGF_STATUS_PARAM << 10);
    /* OGF_LE_CTL: 0x08 */
    COMMANDS.LE_SET_EVENT_MASK_CMD = COMMANDS.OCF_LE_SET_EVENT_MASK | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_BUFFER_SIZE_CMD = COMMANDS.OCF_LE_READ_BUFFER_SIZE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_LOCAL_SUPPORTED_FEATURES_CMD = COMMANDS.OCF_LE_READ_LOCAL_SUPPORTED_FEATURES | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_RANDOM_ADDRESS_CMD = COMMANDS.OCF_LE_SET_RANDOM_ADDRESS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_ADVERTISING_CHANNEL_TX_POWER_CMD = COMMANDS.OCF_LE_READ_ADVERTISING_CHANNEL_TX_POWER | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_SCAN_PARAMETERS_CMD = COMMANDS.OCF_LE_SET_SCAN_PARAMETERS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_SCAN_ENABLE_CMD = COMMANDS.OCF_LE_SET_SCAN_ENABLE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CREATE_CONN_CMD = COMMANDS.OCF_LE_CREATE_CONN | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CREATE_CONN_CANCEL_CMD = COMMANDS.OCF_LE_CREATE_CONN_CANCEL | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CONN_UPDATE_CMD = COMMANDS.OCF_LE_CONN_UPDATE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_START_ENCRYPTION_CMD = COMMANDS.OCF_LE_START_ENCRYPTION | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD = COMMANDS.OCF_LE_SET_ADVERTISING_PARAMETERS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_ENCRYPT_CMD = COMMANDS.OCF_LE_ENCRYPT | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_RAND_CMD = COMMANDS.OCF_LE_RAND | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_ADVERTISING_DATA_CMD = COMMANDS.OCF_LE_SET_ADVERTISING_DATA | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD = COMMANDS.OCF_LE_SET_SCAN_RESPONSE_DATA | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD = COMMANDS.OCF_LE_SET_ADVERTISE_ENABLE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_LTK_NEG_REPLY_CMD = COMMANDS.OCF_LE_LTK_NEG_REPLY | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_WHITE_LIST_SIZE_CMD = COMMANDS.OCF_LE_READ_WHITE_LIST_SIZE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CLEAR_WHITE_LIST_CMD = COMMANDS.OCF_LE_CLEAR_WHITE_LIST | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_SUPPORTED_STATES_CMD = COMMANDS.OCF_LE_READ_SUPPORTED_STATES | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_SUGGESTED_DEFAULT_DATA_LENGTH_CMD = COMMANDS.OCF_LE_READ_SUGGESTED_DEFAULT_DATA_LENGTH | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_WRITE_SUGGESTED_DEFAULT_DATA_LENGTH_CMD = COMMANDS.OCF_LE_WRITE_SUGGESTED_DEFAULT_DATA_LENGTH | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CLEAR_RESOLVING_LIST_CMD = COMMANDS.OCF_LE_CLEAR_RESOLVING_LIST | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_RESOLVING_LIST_SIZE_CMD = COMMANDS.OCF_LE_READ_RESOLVING_LIST_SIZE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_RESOLVABLE_PRIVATE_ADDRESS_TIMEOUT_CMD = COMMANDS.OCF_LE_SET_RESOLVABLE_PRIVATE_ADDRESS_TIMEOUT | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_MAXIMUM_DATA_LENGTH_CMD = COMMANDS.OCF_LE_READ_MAXIMUM_DATA_LENGTH | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_DEFAULT_PHY_CMD = COMMANDS.OCF_LE_SET_DEFAULT_PHY | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_PHY_CMD = COMMANDS.OCF_LE_READ_PHY | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_PHY_CMD = COMMANDS.OCF_LE_SET_PHY | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_EXTENDED_ADVERTISING_PARAMETERS_CMD = COMMANDS.OCF_LE_SET_EXTENDED_ADVERTISING_PARAMETERS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_EXTENDED_ADVERTISING_DATA_CMD = COMMANDS.OCF_LE_SET_EXTENDED_ADVERTISING_DATA | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_EXTENDED_SCAN_RESPONSE_DATA_CMD = COMMANDS.OCF_LE_SET_EXTENDED_SCAN_RESPONSE_DATA | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_EXTENDED_ADVERTISING_ENABLE_CMD = COMMANDS.OCF_LE_SET_EXTENDED_ADVERTISING_ENABLE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_MAXIMUM_ADVERTISING_DATA_LENGTH_CMD = COMMANDS.OCF_LE_READ_MAXIMUM_ADVERTISING_DATA_LENGTH | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CLEAR_ADVERTISING_SETS_CMD = COMMANDS.OCF_LE_CLEAR_ADVERTISING_SETS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_PERIODIC_ADVERTISING_PARAMETERS_CMD = COMMANDS.OCF_LE_SET_PERIODIC_ADVERTISING_PARAMETERS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_PERIODIC_ADVERTISING_DATA_CMD = COMMANDS.OCF_LE_SET_PERIODIC_ADVERTISING_DATA | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_PERIODIC_ADVERTISING_ENABLE_CMD = COMMANDS.OCF_LE_SET_PERIODIC_ADVERTISING_ENABLE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_EXTENDED_SCAN_PARAMETERS_CMD = COMMANDS.OCF_LE_SET_EXTENDED_SCAN_PARAMETERS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_EXTENDED_SCAN_ENABLE_CMD = COMMANDS.OCF_LE_SET_EXTENDED_SCAN_ENABLE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_EXTENDED_CREATE_CONNECTION_CMD = COMMANDS.OCF_LE_EXTENDED_CREATE_CONNECTION | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_PERIODIC_ADVERTISING_CREATE_SYNC_CMD = COMMANDS.OCF_LE_PERIODIC_ADVERTISING_CREATE_SYNC | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_PERIODIC_ADVERTISING_CREATE_SYNC_CANCEL_CMD = COMMANDS.OCF_LE_PERIODIC_ADVERTISING_CREATE_SYNC_CANCEL | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_PERIODIC_ADVERTISING_TERMINATE_SYNC_CMD = COMMANDS.OCF_LE_PERIODIC_ADVERTISING_TERMINATE_SYNC | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_ADD_DEVICE_TO_PERIODIC_ADVERTISER_LIST_CMD = COMMANDS.OCF_LE_ADD_DEVICE_TO_PERIODIC_ADVERTISER_LIST | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_REMOVE_DEVICE_TO_PERIODIC_ADVERTISER_LIST_CMD = COMMANDS.OCF_LE_REMOVE_DEVICE_TO_PERIODIC_ADVERTISER_LIST | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CLEAR_DEVICE_TO_PERIODIC_ADVERTISER_LIST_CMD = COMMANDS.OCF_LE_CLEAR_DEVICE_TO_PERIODIC_ADVERTISER_LIST | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.HCI_OE_USER_ENDED_CONNECTION = 0x13;
})(COMMANDS || (COMMANDS = {}));
const hci_status_json_1 = __importDefault(require("./hci-status.json"));
/**
 * @ignore
 */
class Hci extends eventemitter3_1.default {
    constructor(obnizHci) {
        super();
        this._state = 'poweredOff';
        this._aclStreamObservers = {};
        this._extendedAdvertiseJoinData = {};
        /**
         * @ignore
         * @private
         */
        this.debugHandler = () => {
            // do nothing.
        };
        this._obnizHci = obnizHci;
        this._obnizHci.Obniz.on('_close', () => {
            this.stateChange('poweredOff');
        });
        this._socket = {
            write: (data) => {
                const arr = Array.from(data);
                this._obnizHci.write(arr);
                // console.log(
                //   'SEND:',
                //   Buffer.from(arr)
                //     .toString('hex')
                //     .match(/.{1,2}/g)!
                //     .join(' ')
                // );
            },
        };
        this._obnizHci.hciProtocolOnSocketData = this.onSocketData.bind(this);
        this._obnizHci.onread = this._obnizHci.hciProtocolOnSocketData;
        this.resetBuffers();
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.stateChange('poweredOff');
        this.resetBuffers();
    }
    async initWait() {
        await this.resetWait();
    }
    setEventMaskCommand(mask) {
        const cmd = Buffer.alloc(12);
        const eventMask = Buffer.from(mask, 'hex');
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.SET_EVENT_MASK_CMD, 1);
        // length
        cmd.writeUInt8(eventMask.length, 3);
        eventMask.copy(cmd, 4);
        this.debug('set event mask - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async resetWait() {
        if (this._obnizHci.Obniz.hw === 'cc3235mod') {
            await this.resetForNrf52832Wait();
        }
        else {
            await this.resetForOldObnizjsWait();
            // await this.resetForEsp32Wait();
        }
    }
    async resetForNrf52832Wait() {
        this._reset();
        await this.resetCommandWait();
        const features = await this.readLocalSupportedFeaturesCommandWait();
        const localVersion = await this.readLocalVersionCommandWait();
        const addr = await this.readBdAddrWait();
        const bufSize = await this.leReadBufferSizeWait();
        const leFeatures = await this.leReadLocalSupportedFeaturesCommandWait();
        const leSupportedStates = await this.leReadSupportedStatesCommandWait();
        const supportedCommands = await this.readLocalSupportedCommandWait();
        // this.setEventMaskCommand('fffffbff07f8bf3d');
        // this.setLeEventMaskCommand('1f00000000000000');
        this.setEventMaskCommand('90E8040200800020');
        this.setLeEventMaskCommand('5F0E080000000000');
        const txPower = await this.leReadAdvertisingPhysicalChannelTxPowerCommandWait();
        const whiteListSize = await this.leReadWhiteListSizeWait();
        await this.leClearWhiteListCommandWait();
        const resolvingListSize = await this.leReadResolvingListSizeCommandWait();
        await this.leClearResolvingListCommandWait();
        await this.leSetResolvablePrivateAddressTimeoutCommandWait(0x0384);
        const maximumDataLength = await this.leReadMaximumDataLengthCommandWait();
        this.setEventMaskPage2('0000800000000000'); // TODO
        const defaultDataLength = await this.leReadSuggestedDefaultDataLengthCommandWait();
        // await this.leWriteSuggestedDefaultDataLengthCommandWait(0x00fb, 0x0a90);
        await this.leSetDefaultPhyCommandWait(0, 0, 1);
        // await this.setAdvertisingDataWait(Buffer.alloc(31));
        await this.setRandomDeviceAddressWait();
    }
    async resetForOldObnizjsWait() {
        this._reset();
        await this.resetCommandWait();
        this.setEventMaskCommand('fffffbff07f8bf3d');
        // this.setLeEventMaskCommand('1ff8070000000000');
        this.setLeEventMaskCommand('1f1A000000000000');
        const { hciVer, hciRev, lmpVer, manufacturer, lmpSubVer, } = await this.readLocalVersionCommandWait();
        this.writeLeHostSupportedCommand();
        await this.readLeHostSupportedWait();
        const addr = await this.readBdAddrWait();
        const bufsize = await this.leReadBufferSizeWait();
        if (bufsize) {
            this.debug(`Buffer Mtu=${bufsize.aclMtu} aclMaxInProgress=${bufsize.aclMaxInProgress}`);
        }
        // await this.setRandomDeviceAddressWait();
        if (this._state !== 'poweredOn' && !this._obnizHci._extended) {
            await this.setScanEnabledWait(false, true);
            await this.setScanParametersWait(false);
            this.stateChange('poweredOn');
        }
    }
    async resetForEsp32Wait() {
        this._reset();
        await this.resetCommandWait();
        const bufSize = await this.readBufferSizeWait();
        const localVersion = await this.readLocalVersionCommandWait();
        const addr = await this.readBdAddrWait();
        const localSupportedCommands = await this.readLocalSupportedCommandWait();
        const localExtendedFeatures = [
            await this.readLocalExtendedFeaturesCommandWait(0),
        ];
        if (localExtendedFeatures[0].maximumPageNumber > 0) {
            for (let i = 1; i <= localExtendedFeatures[0].maximumPageNumber; i++) {
                localExtendedFeatures.push(await this.readLocalExtendedFeaturesCommandWait(i));
            }
        }
        await this.writeSimplePairingModeCommandWait('enabled');
        this.writeLeHostSupportedCommand();
        const whiteListSize = await this.leReadWhiteListSizeWait();
        const leBufSize = await this.leReadBufferSizeWait();
        if (leBufSize) {
            this.debug(`Buffer Mtu=${leBufSize.aclMtu} aclMaxInProgress=${leBufSize.aclMaxInProgress}`);
        }
        const supportedStates = await this.leReadSupportedStatesCommandWait();
        const localSupportedFeatures = await this.leReadLocalSupportedFeaturesCommandWait();
        const resolvingListSize = await this.leReadResolvingListSizeCommandWait();
        await this.leWriteSuggestedDefaultDataLengthCommandWait(0x00fb, 0x0848);
        const defaultDataLength = await this.leReadSuggestedDefaultDataLengthCommandWait();
        this.setLeEventMaskCommand('7f06000000000000');
        this.setEventMaskCommand('FFFFFFFFFFFFBF3D');
        // this.setLeEventMaskCommand('1f00000000000000');
        // this.setEventMaskCommand('fffffbff07f8bf3d');
        await this.leClearResolvingListCommandWait();
        await this.leSetResolvablePrivateAddressTimeoutCommandWait(0x0384);
        await this.writeInquiryModeCommandWait('inquiryResultWithRSSIFormatOrExtendedInquiryResultFormat');
        await this.writePageScanTypeCommandWait('interlacedScan');
        await this.writeInquiryScanTypeCommandWait('interlacedScan');
        await this.writeClassOfDeviceCommandWait(0x2c0414);
        await this.writePageTimeoutCommandWait(0x2000);
        await this.writeDefaultLinkPolicyCommandWait(['enableSniffMode']);
        const localName = await this.readLocalNameCommandWait();
        this.debug('le localName ' + localName);
        if (this._state !== 'poweredOn') {
            await this.setScanEnabledWait(false, true);
            await this.setScanParametersWait(false);
            this.stateChange('poweredOn');
        }
    }
    async resetCommandWait() {
        const resetResult = await this.writeNoParamCommandWait(COMMANDS.RESET_CMD, 'reset');
        return resetResult;
    }
    async setRandomDeviceAddressWait() {
        // await this.leRandWait();
        // await this.leEncryptWait();
        await this.leSetRandomAddressWait(Buffer.from([254, 117, 174, 251, 138, 21]));
    }
    async leEncryptWait(key, plainTextData) {
        const cmd = Buffer.alloc(4 + 16 + 16);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_ENCRYPT_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        key.copy(cmd, 4);
        plainTextData.copy(cmd, 4 + 16);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_ENCRYPT_CMD);
        this.debug('le encrypt - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        const encryptedData = data.result;
        return { encryptedData };
    }
    async leRandWait() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_RAND_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_RAND_CMD);
        this.debug('le rand - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        const randomNumber = data.result;
        return { randomNumber };
    }
    async leSetRandomAddressWait(randomAddress) {
        const cmd = Buffer.alloc(4 + 6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_RANDOM_ADDRESS_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        randomAddress.copy(cmd, 4);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_RANDOM_ADDRESS_CMD);
        this.debug('le set random address - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
    }
    async writeDefaultLinkPolicyCommandWait(mode) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.WRITE_DEFAULT_LINK_POLICY_SETTINGS_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        let modeValue = 0;
        if (mode.includes('enableRoleSwitch')) {
            modeValue = modeValue | 0x01;
        }
        if (mode.includes('enableHoldMode')) {
            modeValue = modeValue | 0x02;
        }
        if (mode.includes('enableSniffMode')) {
            modeValue = modeValue | 0x04;
        }
        cmd.writeUInt16LE(modeValue, 4);
        this.debug('write default link policy - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    resetBuffers() {
        this._handleAclsInProgress = {};
        this._handleBuffers = {};
        this._aclOutQueue = [];
    }
    async readLocalVersionCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.READ_LOCAL_VERSION_CMD, 'read local version');
        const hciVer = data.result.readUInt8(0);
        const hciRev = data.result.readUInt16LE(1);
        const lmpVer = data.result.readInt8(3);
        const manufacturer = data.result.readUInt16LE(4);
        const lmpSubVer = data.result.readUInt16LE(6);
        if (hciVer < 0x06) {
            throw new ObnizError_1.ObnizBleUnsupportedHciError(0x06, hciVer);
        }
        this.debug(`localVersion ${hciVer} ${hciRev} ${lmpVer} ${manufacturer} ${lmpSubVer}`);
        return { hciVer, hciRev, lmpVer, manufacturer, lmpSubVer };
    }
    async readLocalNameCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.READ_LOCAL_NAME_CMD, 'read local name');
        return data.result.toString('ascii');
    }
    async writePageTimeoutCommandWait(pageTimeout = 0x2000) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.WRITE_PAGE_TIMEOUT_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        cmd.writeUInt16LE(pageTimeout, 4);
        this.debug('write page timeout - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async writeClassOfDeviceCommandWait(classOfDevice) {
        const cmd = Buffer.alloc(7);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.WRITE_CLASS_OF_DEVICE_CMD, 1);
        // length
        cmd.writeUInt8(0x03, 3);
        cmd.writeUInt8((classOfDevice >> 0) & 0xff, 4);
        cmd.writeUInt8((classOfDevice >> 8) & 0xff, 5);
        cmd.writeUInt8((classOfDevice >> 16) & 0xff, 6);
        this.debug('write class of device - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async writeInquiryScanTypeCommandWait(scanType) {
        const data = await this.writeSingleParamCommandWait(COMMANDS.WRITE_INQUIRY_SCAN_TYPE_CMD, scanType, {
            standardScan: 0x00,
            interlacedScan: 0x01,
        }, 'write inquiry mode type ');
    }
    async writeInquiryModeCommandWait(inquiryMode) {
        const data = await this.writeSingleParamCommandWait(COMMANDS.WRITE_INQUIRY_MODE_CMD, inquiryMode, {
            standardInquiryResultEventFormat: 0x00,
            inquiryResultFormatWithRSSI: 0x01,
            inquiryResultWithRSSIFormatOrExtendedInquiryResultFormat: 0x02,
        }, 'write inquiry mode type ');
    }
    async writePageScanTypeCommandWait(pageScanType) {
        const data = await this.writeSingleParamCommandWait(COMMANDS.WRITE_PAGE_SCAN_TYPE_CMD, pageScanType, {
            standardScan: 0x00,
            interlacedScan: 0x01,
        }, 'write page scan type');
    }
    async writeSimplePairingModeCommandWait(simplePairingMode) {
        const data = await this.writeSingleParamCommandWait(COMMANDS.WRITE_SIMPLE_PAIRING_MODE_CMD, simplePairingMode, {
            disabled: 0x00,
            enabled: 0x01,
        }, 'write simple pairing mode');
    }
    setEventMaskPage2(mask) {
        const cmd = Buffer.alloc(12);
        const leEventMask = Buffer.from(mask, 'hex');
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.SET_EVENT_MASK_PAGE_2_CMD, 1);
        // length
        cmd.writeUInt8(leEventMask.length, 3);
        leEventMask.copy(cmd, 4);
        this.debug('set le event mask page 2 - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async readLocalSupportedCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.READ_LOCAL_SUPPORTED_COMMANDS_CMD, 'read local supported commands');
        this.debug('supportedCommands = ' + data.result.toString('hex'));
        return data.result;
    }
    async readLocalSupportedFeaturesCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.READ_LOCAL_SUPPORTED_FEATURES_CMD, 'read local supported features');
        this.debug('supportedFeatures = ' + data.result.toString('hex'));
        return data.result;
    }
    async readLocalExtendedFeaturesCommandWait(page) {
        const cmd = Buffer.alloc(5);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.READ_LOCAL_EXTENDED_FEATURES_CMD, 1);
        // length
        cmd.writeUInt8(1, 3);
        cmd.writeUInt8(page, 4);
        const p = this.readCmdCompleteEventWait(COMMANDS.READ_LOCAL_EXTENDED_FEATURES_CMD);
        this.debug(`read local extended features - writing: ${cmd.toString('hex')}`);
        this._socket.write(cmd);
        const resetResult = await p;
        return {
            pageNumber: resetResult.result.readUInt8(0),
            maximumPageNumber: resetResult.result.readUInt8(1),
            extendedLmpFeatures: resetResult.result.slice(2),
        };
    }
    async leClearWhiteListCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_CLEAR_WHITE_LIST_CMD, 'le clear white list');
        return data.result;
    }
    async leReadSupportedStatesCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_SUPPORTED_STATES_CMD, 'le read supported states');
        return data.result;
    }
    async leReadSuggestedDefaultDataLengthCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_SUGGESTED_DEFAULT_DATA_LENGTH_CMD, 'le read suggested default data length');
        return {
            suggestedMaxTxOctets: data.result.readUInt16LE(0),
            suggestedMaxTxTime: data.result.readUInt16LE(2),
        };
    }
    async leWriteSuggestedDefaultDataLengthCommandWait(suggestedMaxTxOctets, suggestedMaxTxTime) {
        const cmd = Buffer.alloc(8);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_WRITE_SUGGESTED_DEFAULT_DATA_LENGTH_CMD, 1);
        // length
        cmd.writeUInt8(4, 3);
        cmd.writeUInt16LE(suggestedMaxTxOctets, 4);
        cmd.writeUInt16LE(suggestedMaxTxTime, 6);
        this.debug('le write suggested default data length - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async leClearResolvingListCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_CLEAR_RESOLVING_LIST_CMD, 'le clear resolving list');
    }
    async leReadResolvingListSizeCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_RESOLVING_LIST_SIZE_CMD, 'le read resolving list size');
        return data.result.readInt8(0);
    }
    async leSetResolvablePrivateAddressTimeoutCommandWait(rpaTimeout) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_RESOLVABLE_PRIVATE_ADDRESS_TIMEOUT_CMD, 1);
        // length
        cmd.writeUInt8(2, 3);
        cmd.writeUInt16LE(rpaTimeout, 4);
        this.debug('le set resolvable private address timeout - writing: ' +
            cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async leReadMaximumDataLengthCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_MAXIMUM_DATA_LENGTH_CMD, 'le read maximum data length');
        return {
            supportedMaxTxOctets: data.result.readUInt16LE(0),
            supportedMaxTxTime: data.result.readUInt16LE(2),
            supportedMaxRxOctets: data.result.readUInt16LE(4),
            supportedMaxRxTime: data.result.readUInt16LE(6),
        };
    }
    async leReadLocalSupportedFeaturesCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_LOCAL_SUPPORTED_FEATURES_CMD, 'le read local supported features');
        this.debug('read local supported features = ' + data.result.toString('hex'));
        return data.result;
    }
    async leReadPhyCommandWait(connectionHandle) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_READ_PHY_CMD, 1);
        // length
        cmd.writeUInt8(2, 3);
        cmd.writeUInt16LE(connectionHandle, 4);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_READ_PHY_CMD);
        this.debug(`read Phy - writing: ${cmd.toString('hex')}`);
        this._socket.write(cmd);
        const data = await p;
        return {
            status: data.status,
            connectionHandle: data.result.readUInt16LE(0),
            txPhy: data.result.readUInt8(2),
            rxPhy: data.result.readUInt8(3),
        };
    }
    // 接続後にのみ使用可能
    async leSetPhyCommandWait(connectionHandle, allPhys, txPhys, rxPhys, options) {
        const cmd = Buffer.alloc(11);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_PHY_CMD, 1);
        // length
        cmd.writeUInt8(7, 3);
        cmd.writeUInt16LE(connectionHandle, 4);
        cmd.writeUInt8(allPhys, 6);
        cmd.writeUInt8(txPhys, 7);
        cmd.writeUInt8(rxPhys, 8);
        cmd.writeUInt16LE(options, 9);
        this.debug('le set phy - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async setExtendedAdvertisingParametersWait(handle, eventProperties, primaryAdvertisingPhy, secondaryAdvertisingPhy, txPower) {
        const cmd = Buffer.alloc(29);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_EXTENDED_ADVERTISING_PARAMETERS_CMD, 1);
        // length
        cmd.writeUInt8(25, 3);
        const advertisementInterval = Math.floor((process.env.BLENO_ADVERTISING_INTERVAL
            ? parseFloat(process.env.BLENO_ADVERTISING_INTERVAL)
            : 100) * 1.6);
        // data
        cmd.writeUInt8(handle, 4);
        cmd.writeUInt16LE(eventProperties, 5); // Advertising_Event_Properties
        // Broadcast(0x0000)(ADV Data 1650B send) or Scannable(0x0002)(ScanRsp Data 1650B send)
        cmd.writeUInt16LE(advertisementInterval, 7); // min interval //default 100ms
        cmd.writeUInt8((advertisementInterval >> 16) & 0xff, 9); // min interval
        cmd.writeUInt16LE(advertisementInterval * 2, 10); // max interval
        cmd.writeUInt8(((advertisementInterval * 2) >> 16) & 0xff, 12); // max interval
        cmd.writeUInt8(0x07, 13); // Primary_Advertising_Channel_Map used 37,38,39ch
        cmd.writeUInt8(0x00, 14); // Own_Address_Type direct addr type
        cmd.writeUInt8(0x00, 15); // Peer_Address_Type
        Buffer.from('000000000000', 'hex').copy(cmd, 16); // direct addr
        cmd.writeUInt8(0x00, 22); // Advertising_Filter_Policy All Devices
        cmd.writeUInt8(txPower, 23); // Advertising_Tx_Power
        cmd.writeUInt8(primaryAdvertisingPhy, 24); // PrimaryAdvertisingPhy
        cmd.writeUInt8(0x00, 25); // Secondary_Advertising_Max_Skip
        cmd.writeUInt8(secondaryAdvertisingPhy, 26); // SecondaryAdvertisingPhy
        cmd.writeUInt8(0x00, 27); // Advertising_SID
        cmd.writeUInt8(0x00, 28); // Scan_Request_Notification_Enable
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_EXTENDED_ADVERTISING_PARAMETERS_CMD);
        this.debug('set extended advertisement parameters - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        // this.emit("stateChange", "poweredOn"); // TODO : really need?
        return {
            status: data.status,
            txPower: data.result.readUInt8(0),
        };
    }
    extendedAdvertiseOperation(index, length) {
        if (index === 0) {
            if (length <= 251)
                return 3; // Operation コンプリートスキャン応答データ
            return 1; // Operation 断片化されたスキャンレスポンスデータの最初の断片
        }
        if (length - index * 251 <= 251)
            return 2; // Operation 断片化したスキャンレスポンスデータの最後の断片
        return 0; // Operation 断片化したスキャンレスポンスデータの中間断片
    }
    async setExtendedAdvertisingDataWait(handle, data) {
        for (let i = 0; i < data.length / 251; i++) {
            const size = data.length - i * 251 > 251 ? 251 : data.length - i * 251;
            const cmd = Buffer.alloc(size + 4 + 4);
            // header
            cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
            cmd.writeUInt16LE(COMMANDS.LE_SET_EXTENDED_ADVERTISING_DATA_CMD, 1);
            // length
            cmd.writeUInt8(size + 4, 3);
            // data
            cmd.writeUInt8(handle, 4);
            cmd.writeUInt8(this.extendedAdvertiseOperation(i, data.length), 5);
            cmd.writeUInt8(0x00, 6); // Fragment_Preference
            cmd.writeUInt8(size, 7); // Data_Length
            data.copy(cmd, 8, i * 251, i * 251 + size);
            const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_EXTENDED_ADVERTISING_DATA_CMD);
            this.debug('set extended advertisement data - writing: ' + cmd.toString('hex'));
            this._socket.write(cmd);
            const result = await p;
            if (result.status !== 0) {
                return result.status;
            }
        }
        return 0;
    }
    // 今の仕様だとScanResponseはExtendedでサポートしていない
    async setExtendedAdvertisingScanResponseDataWait(handle, data) {
        for (let i = 0; i < data.length / 251; i++) {
            const size = data.length - i * 251 > 251 ? 251 : data.length - i * 251;
            const cmd = Buffer.alloc(size + 4 + 4);
            // header
            cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
            cmd.writeUInt16LE(COMMANDS.LE_SET_EXTENDED_SCAN_RESPONSE_DATA_CMD, 1);
            // length
            cmd.writeUInt8(size + 4, 3);
            // data
            cmd.writeUInt8(handle, 4);
            cmd.writeUInt8(this.extendedAdvertiseOperation(i, data.length), 5);
            cmd.writeUInt8(0x00, 6); // Fragment_Preference
            cmd.writeUInt8(size, 7); // Data_Length
            data.copy(cmd, 8, i * 251, i * 251 + size);
            const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_EXTENDED_SCAN_RESPONSE_DATA_CMD);
            this.debug('set extended scan response data - writing: ' + cmd.toString('hex'));
            this._socket.write(cmd);
            const result = await p;
            if (result.status !== 0) {
                return result.status;
            }
        }
        return 0;
    }
    async setExtendedAdvertisingEnableWait(enabled, enableList) {
        const cmd = Buffer.alloc(enableList.length * 4 + 4 + 2);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_EXTENDED_ADVERTISING_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(enableList.length * 4 + 2, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        cmd.writeUInt8(enableList.length, 5); // length
        for (let i = 0; i < enableList.length; i++) {
            cmd.writeUInt8(enableList[i].handle, 6 + i * 4); // handle
            cmd.writeUInt16LE(enableList[i].duration, 7 + i * 4); // duration
            cmd.writeUInt8(enableList[i].events, 9 + i * 4); // events
        }
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_EXTENDED_ADVERTISING_ENABLE_CMD);
        this.debug('set extended advertise enable - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        return data.status;
    }
    async leReadMaximumAdvertisingDataLengthWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_MAXIMUM_ADVERTISING_DATA_LENGTH_CMD, 'le read maximum advertising data length');
        return data.result.readUInt16LE(0);
    }
    // 先にsetExtendedAdvertiseEnableWaitで無効化してから行うこと
    async leClearAdvertisingSetWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_CLEAR_ADVERTISING_SETS_CMD, 'le clear advertising Set');
        return data.result.readUInt16LE(0);
    }
    async setExtendedScanParametersWait(isActiveScan, usePhy1m = true, usePhyCoded = true) {
        const booleanToNumber = (flg) => (flg ? 1 : 0);
        const cmd = Buffer.alloc(7 + (booleanToNumber(usePhy1m) + booleanToNumber(usePhyCoded)) * 5);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_EXTENDED_SCAN_PARAMETERS_CMD, 1);
        // length
        cmd.writeUInt8(3 + (booleanToNumber(usePhy1m) + booleanToNumber(usePhyCoded)) * 5, 3);
        // data
        cmd.writeUInt8(0x00, 4); // Own_Address_Type 公開端末アドレス
        cmd.writeUInt8(0x00, 5); // Scanning_Filter_Policy：本装置宛でない有向広告パケットを除くすべての広告パケットを受信する
        cmd.writeUInt8(booleanToNumber(usePhy1m) + (booleanToNumber(usePhyCoded) << 2), 6); // Scanning_PHYs：1M Phy and Coded Phy 0b00000101
        for (let i = 0; i < booleanToNumber(usePhy1m) + booleanToNumber(usePhyCoded); i++) {
            cmd.writeUInt8(isActiveScan ? 0x01 : 0x00, 7 + i * 5); // Scan_Type ActiveScan 1
            // コントローラが最後のスキャンを開始してから、プライマリ広告チャネルで次のスキャンを開始するまでの時間間隔。
            cmd.writeUInt16LE(0x0010, 8 + i * 5); // Scan_Interval //default 10ms //もともとのスキャン機能のインターバルから引用
            // 主広告チャンネルでのスキャンの持続時間
            cmd.writeUInt16LE(0x0010, 10 + i * 5); // Scan_Window //default 10ms
        }
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_EXTENDED_SCAN_PARAMETERS_CMD);
        this.debug('set extended scan parameters - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        return data.status;
    }
    async setExtendedScanEnabledWait(enabled, filterDuplicates) {
        this._extendedAdvertiseJoinData = {};
        const cmd = Buffer.alloc(10);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_EXTENDED_SCAN_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(0x06, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        cmd.writeUInt8(filterDuplicates ? 0x01 : 0x00, 5); // 0x01 => filter enabled, 0x00 => filter disable
        cmd.writeUInt16LE(0x0000, 6); // Scan_Duration 明示的に無効化されるまで連続スキャン 既存のスキャンと同じように
        cmd.writeUInt16LE(0x0000, 8); // Scan_Period 定期的なスキャンを無効にする 連続スキャンなのではいらない
        this.debug(`set extended scan ${enabled ? 'enabled' : 'disable'} - writing: ${cmd.toString('hex')}`);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_EXTENDED_SCAN_ENABLE_CMD);
        this._socket.write(cmd);
        const data = await p;
        return data.status;
    }
    async createLeExtendedConnWait(address, addressType, timeout = 90 * 1000, onConnectCallback, pyh1m = true, pyh2m = true, pyhCoded = true) {
        const booleanToNumber = (flg) => (flg ? 1 : 0);
        const configCount = booleanToNumber(pyh1m) +
            booleanToNumber(pyh2m) +
            booleanToNumber(pyhCoded);
        const cmd = Buffer.alloc(configCount * 16 + 10 + 4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_EXTENDED_CREATE_CONNECTION_CMD, 1);
        // length
        cmd.writeUInt8(configCount * 16 + 10, 3);
        const parameter = {
            interval: 0x0010,
            window: 0x0010,
            minInterval: 0x0009,
            maxInterval: 0x0018,
            latency: 0x0001,
            supervisionTimeout: 0x0190,
            minCeLength: 0x0000,
            maxCeLength: 0x0000,
        };
        // data
        cmd.writeUInt8(0x00, 4); // Initiating_Filter_Policy ホワイトリストは使用しません
        cmd.writeUInt8(0x00, 5); // Own_Address_Type 公開端末アドレス
        cmd.writeUInt8(addressType === 'random' ? 0x01 : 0x00, 6); // peer address type
        bleHelper_1.default.hex2reversedBuffer(address, ':').copy(cmd, 7); // peer address
        cmd.writeUInt8(booleanToNumber(pyh1m) +
            booleanToNumber(pyh2m) * 2 +
            booleanToNumber(pyhCoded) * 4, 13); // Initiating_PHY
        for (let i = 0; i < configCount; i++) {
            cmd.writeUInt16LE(parameter.interval, 14 + i * 16); // interval
            cmd.writeUInt16LE(parameter.window, 16 + i * 16); // window
            cmd.writeUInt16LE(parameter.minInterval, 18 + i * 16); // minInterval
            cmd.writeUInt16LE(parameter.maxInterval, 20 + i * 16); // maxInterval
            cmd.writeUInt16LE(parameter.latency, 22 + i * 16); // latency
            cmd.writeUInt16LE(parameter.supervisionTimeout, 24 + i * 16); // supervisionTimeout
            cmd.writeUInt16LE(parameter.minCeLength, 26 + i * 16); // minCeLength
            cmd.writeUInt16LE(parameter.maxCeLength, 28 + i * 16); // maxCeLength
        }
        this.debug('create le extended conn - writing: ' + cmd.toString('hex'));
        const processConnectionCompletePromise = (async () => {
            const { status, data } = await this.readLeMetaEventWait(COMMANDS.EVT_LE_CONN_COMPLETE, {
                timeout,
                waitingFor: 'EVT_LE_CONN_COMPLETE',
            });
            return { status, data: this.parseConnectionCompleteEventData(data) };
        })();
        const processLeConnectionCompletePromise = (async () => {
            const { status, data } = await this.readLeMetaEventWait(COMMANDS.EVT_LE_ENHANCED_CONNECTION_COMPLETE, {
                timeout,
                waitingFor: 'EVT_LE_ENHANCED_CONNECTION_COMPLETE',
            });
            return { status, data: this.parseLeConnectionCompleteEventData(data) };
        })();
        this._socket.write(cmd);
        const result = await Promise.race([
            processConnectionCompletePromise,
            processLeConnectionCompletePromise,
        ]);
        return this.processLeConnComplete(result.status, result.data, onConnectCallback);
    }
    async leSetDefaultPhyCommandWait(allPhys, txPhys, rxPhys) {
        const cmd = Buffer.alloc(7);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_DEFAULT_PHY_CMD, 1);
        // length
        cmd.writeUInt8(3, 3);
        cmd.writeUInt8(allPhys, 4);
        cmd.writeUInt8(txPhys, 5);
        cmd.writeUInt8(rxPhys, 6);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_DEFAULT_PHY_CMD);
        this.debug('le set default phy - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        return data.status;
    }
    async leReadAdvertisingPhysicalChannelTxPowerCommandWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_ADVERTISING_CHANNEL_TX_POWER_CMD, 'le read advertising channel tx power');
        return data.result.readInt8(0);
    }
    async leReadWhiteListSizeWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_WHITE_LIST_SIZE_CMD, 'le read white list size');
        return data.result.readUInt8(0);
    }
    async readBdAddrWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.READ_BD_ADDR_CMD, 'read bd addr');
        this.addressType = 'public';
        this.address = bleHelper_1.default.buffer2reversedHex(data.result, ':');
        this.debug('address = ' + this.address);
        return this.address;
    }
    setLeEventMaskCommand(mask) {
        const cmd = Buffer.alloc(12);
        const leEventMask = Buffer.from(mask, 'hex');
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_EVENT_MASK_CMD, 1);
        // length
        cmd.writeUInt8(leEventMask.length, 3);
        leEventMask.copy(cmd, 4);
        this.debug('set le event mask - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async readLeHostSupportedWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.READ_LE_HOST_SUPPORTED_CMD, 'read LE host supported');
        if (data.status === 0) {
            const le = data.result.readUInt8(0);
            const simul = data.result.readUInt8(1);
            this.debug('\t\t\tle = ' + le);
            this.debug('\t\t\tsimul = ' + simul);
        }
        return data;
    }
    writeLeHostSupportedCommand() {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.WRITE_LE_HOST_SUPPORTED_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt8(0x01, 4); // le
        cmd.writeUInt8(0x00, 5); // simul
        this.debug('write LE host supported - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async setScanParametersWait(isActiveScan) {
        const cmd = Buffer.alloc(11);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_PARAMETERS_CMD, 1);
        // length
        cmd.writeUInt8(0x07, 3);
        // data
        cmd.writeUInt8(isActiveScan ? 0x01 : 0x00, 4); // type: 0 -> passive, 1 -> active
        cmd.writeUInt16LE(0x0010, 5); // internal, ms * 1.6
        cmd.writeUInt16LE(0x0010, 7); // window, ms * 1.6
        const addressType = this._obnizHci.Obniz.hw === 'cc3235mod' ? 0x01 : 0x00;
        cmd.writeUInt8(addressType, 9); // own address type: 0 -> public, 1 -> random
        cmd.writeUInt8(0x00, 10); // filter: 0 -> all event types
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_SCAN_PARAMETERS_CMD);
        this.debug(`set scan parameters=${isActiveScan ? 'active' : 'passive'} - writing: ${cmd.toString('hex')}`);
        this.debug('set scan parameters - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        return data.status;
    }
    async setScanEnabledWait(enabled, filterDuplicates) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        cmd.writeUInt8(filterDuplicates ? 0x01 : 0x00, 5); // 0x01 => filter enabled, 0x00 => filter disable
        this.debug(`set scan ${enabled ? 'enabled' : 'disable'} - writing: ${cmd.toString('hex')}`);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_SCAN_ENABLE_CMD);
        this._socket.write(cmd);
        const data = await p;
        return data.status;
    }
    async createLeConnWait(address, addressType, timeout = 90 * 1000, onConnectCallback, parameterType = 'obnizjs<3_18_0') {
        const cmd = Buffer.alloc(29);
        // 010d2019600030000000965d341a9ea0000a000c000000580202000000
        // 010d2019600030000000965d341a9ea0000a000c000000580200000000
        // bluedroid
        // 01 0d 20 19 60 00 30 00 00 00  //
        // 96 5d 34 1a 9e a0 00 0a 00 0c  // deviceaddr(6) own address type(1) minInterval(2) maxInterval(1)
        // 00 00 00 58 02 00 00 00 00     // maxInterval(1) latency(2) supervision timeout(2)
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_CREATE_CONN_CMD, 1);
        // length
        cmd.writeUInt8(0x19, 3);
        const parameter = parameterType === 'obnizjs<3_18_0'
            ? {
                interval: 0x0010,
                window: 0x0010,
                initiatorFilter: 0x00,
                minInterval: 0x0009,
                maxInterval: 0x0018,
                latency: 0x0001,
                supervisionTimeout: 0x0190,
                minCeLength: 0x0000,
                maxCeLength: 0x0000,
            }
            : {
                interval: 0x0060,
                window: 0x0030,
                initiatorFilter: 0x00,
                minInterval: 0x000a,
                maxInterval: 0x000c,
                latency: 0x0000,
                supervisionTimeout: 0x0258,
                minCeLength: 0x0000,
                maxCeLength: 0x0000,
            };
        // data
        cmd.writeUInt16LE(parameter.interval, 4); // interval
        cmd.writeUInt16LE(parameter.window, 6); // window
        cmd.writeUInt8(parameter.initiatorFilter, 8); // initiator filter
        cmd.writeUInt8(addressType === 'random' ? 0x01 : 0x00, 9); // peer address type
        bleHelper_1.default.hex2reversedBuffer(address, ':').copy(cmd, 10); // peer address
        cmd.writeUInt8(0x00, 16); // own address type
        cmd.writeUInt16LE(parameter.minInterval, 17); // min interval 9 * 1.25 msec => 7.5msec (close to android)
        cmd.writeUInt16LE(parameter.maxInterval, 19); // max interval 24 * 1.25 msec => 30msec (close to ios)
        cmd.writeUInt16LE(parameter.latency, 21); // latency // cmd.writeUInt16LE(0x0000, 21);
        cmd.writeUInt16LE(parameter.supervisionTimeout, 23); // supervision timeout 4sec // cmd.writeUInt16LE(0x00c8, 23);
        cmd.writeUInt16LE(parameter.minCeLength, 25); // min ce length
        cmd.writeUInt16LE(parameter.maxCeLength, 27); // max ce length
        this.debug('create le conn - writing: ' + cmd.toString('hex'));
        const processConnectionCompletePromise = (async () => {
            const { status, data } = await this.readLeMetaEventWait(COMMANDS.EVT_LE_CONN_COMPLETE, {
                timeout,
                waitingFor: 'EVT_LE_CONN_COMPLETE',
            });
            return { status, data: this.parseConnectionCompleteEventData(data) };
        })();
        const processLeConnectionCompletePromise = (async () => {
            const { status, data } = await this.readLeMetaEventWait(COMMANDS.EVT_LE_ENHANCED_CONNECTION_COMPLETE, {
                timeout,
                waitingFor: 'EVT_LE_ENHANCED_CONNECTION_COMPLETE',
            });
            return { status, data: this.parseLeConnectionCompleteEventData(data) };
        })();
        this._socket.write(cmd);
        const result = await Promise.race([
            processConnectionCompletePromise,
            processLeConnectionCompletePromise,
        ]);
        return this.processLeConnComplete(result.status, result.data, onConnectCallback);
    }
    async createLeConnCancelWait() {
        const { status } = await this.writeNoParamCommandWait(COMMANDS.LE_CREATE_CONN_CANCEL_CMD, 'create le conn cancel');
        if (status !== 0x00) {
            throw new ObnizError_1.ObnizBleHciStateError(status);
        }
    }
    async connUpdateLeWait(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        const cmd = Buffer.alloc(18);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_CONN_UPDATE_CMD, 1);
        // length
        cmd.writeUInt8(0x0e, 3);
        // data
        cmd.writeUInt16LE(handle, 4);
        cmd.writeUInt16LE(Math.floor(minInterval / 1.25), 6); // min interval
        cmd.writeUInt16LE(Math.floor(maxInterval / 1.25), 8); // max interval
        cmd.writeUInt16LE(latency, 10); // latency
        cmd.writeUInt16LE(Math.floor(supervisionTimeout / 10), 12); // supervision timeout
        cmd.writeUInt16LE(0x0000, 14); // min ce length
        cmd.writeUInt16LE(0x0000, 16); // max ce length
        this.debug('conn update le - writing: ' + cmd.toString('hex'));
        const p = this.readLeMetaEventWait(COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE, {
            waitingFor: 'EVT_LE_CONN_UPDATE_COMPLETE',
        });
        this._socket.write(cmd);
        const { status, data } = await p;
        return this.processLeConnUpdateComplete(status, data);
    }
    // this function is use by connUpdateLeWait / processLeMetaEvent.
    processLeConnUpdateComplete(status, data) {
        const handle = data.readUInt16LE(0);
        const interval = data.readUInt16LE(2) * 1.25;
        const latency = data.readUInt16LE(4); // TODO: multiplier?
        const supervisionTimeout = data.readUInt16LE(6) * 10;
        this.debug('\t\t\thandle = ' + handle);
        this.debug('\t\t\tinterval = ' + interval);
        this.debug('\t\t\tlatency = ' + latency);
        this.debug('\t\t\tsupervision timeout = ' + supervisionTimeout);
        return { status, handle, interval, latency, supervisionTimeout };
    }
    async startLeEncryptionWait(handle, random, diversifier, key) {
        const cmd = Buffer.alloc(32);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_START_ENCRYPTION_CMD, 1);
        // length
        cmd.writeUInt8(0x1c, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        random.copy(cmd, 6);
        diversifier.copy(cmd, 14);
        key.copy(cmd, 16);
        // console.log("start le encryption - writing: " + cmd.toString("hex"));
        const p1 = this._obnizHci.readWait([COMMANDS.HCI_EVENT_PKT, COMMANDS.EVT_ENCRYPT_CHANGE], {
            waitingFor: 'EVT_ENCRYPT_CHANGE',
        });
        const p2 = this._obnizHci.readWait([COMMANDS.HCI_EVENT_PKT, COMMANDS.EVT_ENCRYPTION_KEY_REFRESH_COMPLETE], {
            waitingFor: 'EVT_ENCRYPTION_KEY_REFRESH_COMPLETE',
        });
        this.debug('start le encryption - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await Promise.race([p1, p2]);
        // const data = await p1;
        // console.log("start le encryption - data: " + data.toString("hex"));
        if (data.readUInt8(1) === COMMANDS.EVT_ENCRYPT_CHANGE) {
            if (data.length !== 7) {
                throw new Error(`le encryption event EVT_ENCRYPT_CHANGE length must be 7 but recieved ${data.length}`);
            }
            const status = data.readUInt8(3);
            if (status !== 0x00) {
                throw new Error(`le encryption event EVT_ENCRYPT_CHANGE failed with error ${status}`);
            }
            const encHandle = data.readUInt16LE(4);
            const encrypt = data.readUInt8(6);
            this.debug('\t\thandle = ' + encHandle);
            this.debug('\t\tencrypt = ' + encrypt);
            this.emit('encryptChange', encHandle, encrypt);
            return encrypt;
        }
        else if (data[1] === COMMANDS.EVT_ENCRYPTION_KEY_REFRESH_COMPLETE) {
            if (data.length !== 6) {
                throw new Error(`le encryption event EVT_ENCRYPTION_KEY_REFRESH_COMPLETE length must be 7 but recieved ${data.length}`);
            }
            const status = data.readUInt8(3);
            if (status !== 0x00) {
                throw new Error(`le encryption event EVT_ENCRYPTION_KEY_REFRESH_COMPLETE failed with error ${status}`);
            }
            const encHandle = data.readUInt16LE(4);
            this.debug('\t\thandle = ' + encHandle);
            return 'refresh';
        }
        throw new Error('Never Happend');
    }
    disconnect(handle, reason) {
        const cmd = Buffer.alloc(7);
        reason = reason || COMMANDS.HCI_OE_USER_ENDED_CONNECTION;
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.DISCONNECT_CMD, 1);
        // length
        cmd.writeUInt8(0x03, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        cmd.writeUInt8(reason, 6); // reason
        this.debug('disconnect - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
    }
    async readRssiWait(handle) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.READ_RSSI_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        const p = this.readCmdCompleteEventWait(COMMANDS.READ_RSSI_CMD, [
            handle & 0xff,
            (handle >> 8) & 0xff,
        ]);
        this.debug('read rssi - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        if (handle !== data.result.readUInt16LE(0)) {
            throw new Error('handle is different');
        }
        const rssi = data.result.readInt8(2);
        this.debug('\t\t\thandle = ' + handle);
        this.debug('\t\t\trssi = ' + rssi);
        return rssi;
    }
    async setAdvertisingParametersWait() {
        const cmd = Buffer.alloc(19);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD, 1);
        // length
        cmd.writeUInt8(15, 3);
        const advertisementInterval = Math.floor((process.env.BLENO_ADVERTISING_INTERVAL
            ? parseFloat(process.env.BLENO_ADVERTISING_INTERVAL)
            : 100) * 1.6);
        // data
        cmd.writeUInt16LE(advertisementInterval, 4); // min interval
        cmd.writeUInt16LE(advertisementInterval, 6); // max interval
        cmd.writeUInt8(0x00, 8); // adv type
        cmd.writeUInt8(0x00, 9); // own addr typ
        cmd.writeUInt8(0x00, 10); // direct addr type
        Buffer.from('000000000000', 'hex').copy(cmd, 11); // direct addr
        cmd.writeUInt8(0x07, 17);
        cmd.writeUInt8(0x00, 18);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD);
        this.debug('set advertisement parameters - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        // this.emit("stateChange", "poweredOn"); // TODO : really need?
        return data.status;
    }
    async setAdvertisingDataWait(data) {
        const cmd = Buffer.alloc(36);
        cmd.fill(0x00);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_DATA_CMD, 1);
        // length
        cmd.writeUInt8(32, 3);
        // data
        cmd.writeUInt8(data.length, 4);
        data.copy(cmd, 5);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_ADVERTISING_DATA_CMD);
        this.debug('set advertisement data - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const result = await p;
        return result.status;
    }
    async setScanResponseDataWait(data) {
        const cmd = Buffer.alloc(36);
        cmd.fill(0x00);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD, 1);
        // length
        cmd.writeUInt8(32, 3);
        // data
        cmd.writeUInt8(data.length, 4);
        data.copy(cmd, 5);
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD);
        this.debug('set scan response data - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const result = await p;
        return result.status;
    }
    async setAdvertiseEnableWait(enabled) {
        const cmd = Buffer.alloc(5);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(0x01, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        const p = this.readCmdCompleteEventWait(COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD);
        this.debug('set advertise enable - writing: ' + cmd.toString('hex'));
        this._socket.write(cmd);
        const data = await p;
        return data.status;
    }
    async leReadBufferSizeWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.LE_READ_BUFFER_SIZE_CMD, 'le read buffer size ');
        if (!data.status) {
            return await this.processLeReadBufferSizeWait(data.result);
        }
    }
    async readBufferSizeWait() {
        const data = await this.writeNoParamCommandWait(COMMANDS.READ_BUFFER_SIZE_CMD, 'read buffer size');
        if (!data.status) {
            const aclMtu = data.result.readUInt16LE(0);
            const aclMaxInProgress = data.result.readUInt16LE(3);
            // sanity
            if (aclMtu && aclMaxInProgress) {
                this.debug('br/edr acl mtu = ' + aclMtu);
                this.debug('br/edr acl max pkts = ' + aclMaxInProgress);
                this._aclMtu = aclMtu;
                this._aclMaxInProgress = aclMaxInProgress;
                return { aclMtu, aclMaxInProgress };
            }
        }
        return null;
    }
    queueAclDataPkt(handle, cid, data) {
        let hf = handle | (COMMANDS.ACL_START_NO_FLUSH << 12);
        // l2cap pdu may be fragmented on hci level
        let l2capPdu = Buffer.alloc(4 + data.length);
        l2capPdu.writeUInt16LE(data.length, 0);
        l2capPdu.writeUInt16LE(cid, 2);
        data.copy(l2capPdu, 4);
        let fragId = 0;
        while (l2capPdu.length) {
            const frag = l2capPdu.slice(0, this._aclMtu);
            l2capPdu = l2capPdu.slice(frag.length);
            const pkt = Buffer.alloc(5 + frag.length);
            // hci header
            pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
            pkt.writeUInt16LE(hf, 1);
            hf |= COMMANDS.ACL_CONT << 12;
            pkt.writeUInt16LE(frag.length, 3); // hci pdu length
            frag.copy(pkt, 5);
            this._aclOutQueue.push({
                handle,
                pkt,
                fragId: fragId++,
            });
        }
        this.pushAclOutQueue();
    }
    pushAclOutQueue() {
        this.debug('pushAclOutQueue');
        let inProgress = 0;
        for (const handle in this._handleAclsInProgress) {
            inProgress += this._handleAclsInProgress[handle];
        }
        this.debug(inProgress, this._aclMaxInProgress, this._aclOutQueue.length);
        while (inProgress < this._aclMaxInProgress && this._aclOutQueue.length) {
            inProgress++;
            this.writeOneAclDataPkt();
        }
        if (inProgress >= this._aclMaxInProgress && this._aclOutQueue.length) {
            this.debug('acl out queue congested');
            this.debug('\tin progress = ' + inProgress);
            this.debug('\twaiting = ' + this._aclOutQueue.length);
        }
    }
    writeOneAclDataPkt() {
        this.debug('writeOneAclDataPkt');
        const pkt = this._aclOutQueue.shift();
        this._handleAclsInProgress[pkt.handle]++;
        this.debug('write acl data pkt frag ' +
            pkt.fragId +
            ' handle ' +
            pkt.handle +
            ' - writing: ' +
            pkt.pkt.toString('hex'));
        this._socket.write(pkt.pkt);
    }
    writeAclDataPkt(handle, cid, data) {
        const pkt = Buffer.alloc(9 + data.length);
        // header
        pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
        pkt.writeUInt16LE(handle | (COMMANDS.ACL_START_NO_FLUSH << 12), 1);
        pkt.writeUInt16LE(data.length + 4, 3); // data length 1  for acl data on HCI
        pkt.writeUInt16LE(data.length, 5); // data length 2  for l2cap
        pkt.writeUInt16LE(cid, 7);
        data.copy(pkt, 9);
        this.debug('write acl data pkt - writing: ' + pkt.toString('hex'));
        this._socket.write(pkt);
    }
    async longTermKeyRequestNegativeReplyWait(handle) {
        throw new Error('TODO: no checked');
        // const cmd = Buffer.alloc(5);
        //
        // // header
        // cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        // cmd.writeUInt16LE(COMMANDS.LE_LTK_NEG_REPLY_CMD, 1);
        //
        // // length
        // cmd.writeUInt16LE(handle, 3);
        //
        // const p = this.readCmdCompleteEventWait(COMMANDS.LE_LTK_NEG_REPLY_CMD);
        // this._socket.write(cmd);
        // const data = await p;
        // return data.status;
    }
    processLeMetaEvent(eventType, status, data) {
        if (eventType === COMMANDS.EVT_LE_ADVERTISING_REPORT) {
            this.processLeAdvertisingReport(status, data);
        }
        else if (eventType === COMMANDS.EVT_LE_EXTENDED_ADVERTISING_REPORT) {
            this.processLeExtendedAdvertisingReport(status, data);
        }
        else if (eventType === COMMANDS.EVT_LE_CONN_COMPLETE) {
            const role = data.readUInt8(2);
            if (role === 1) {
                const connectionData = this.parseConnectionCompleteEventData(data);
                this.processLeConnComplete(status, connectionData, undefined);
            }
        }
        else if (eventType === COMMANDS.EVT_LE_ENHANCED_CONNECTION_COMPLETE) {
            const role = data.readUInt8(2);
            if (role === 1) {
                const connectionData = this.parseConnectionCompleteEventData(data);
                this.processLeConnComplete(status, connectionData, undefined);
            }
        }
        else if (eventType === COMMANDS.EVT_LE_PHY_UPDATE_COMPLETE) {
            const handler = data.readUInt16LE(0);
            const txPhy = data.readUInt8(2);
            const rxPhy = data.readUInt8(3);
            this.emit('updatePhy', handler, txPhy, rxPhy);
        }
        else if (eventType === COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE) {
            const { handle, interval, latency, supervisionTimeout, } = this.processLeConnUpdateComplete(status, data);
            this.emit('leConnUpdateComplete', status, handle, interval, latency, supervisionTimeout);
        }
    }
    parseConnectionCompleteEventData(data) {
        return {
            handle: data.readUInt16LE(0),
            role: data.readUInt8(2),
            addressType: (data.readUInt8(3) === 0x01
                ? 'random'
                : 'public'),
            address: bleHelper_1.default.buffer2reversedHex(data.slice(4, 10), ':'),
            interval: data.readUInt16LE(10) * 1.25,
            latency: data.readUInt16LE(12),
            supervisionTimeout: data.readUInt16LE(14) * 10,
            masterClockAccuracy: data.readUInt8(16), // TODO: multiplier?
        };
    }
    parseLeConnectionCompleteEventData(data) {
        var _a;
        const addressTypeList = {
            0x00: 'public',
            0x01: 'random',
            0x02: 'rpa_public',
            0x03: 'rpa_random',
        };
        return {
            handle: data.readUInt16LE(0),
            role: data.readUInt8(2),
            addressType: (_a = addressTypeList[data.readUInt8(3)]) !== null && _a !== void 0 ? _a : 'undefined',
            address: bleHelper_1.default.buffer2reversedHex(data.slice(4, 10), ':'),
            localResolvablePrivateAddress: bleHelper_1.default.buffer2reversedHex(data.slice(10, 16), ':'),
            peerResolvablePrivateAddress: bleHelper_1.default.buffer2reversedHex(data.slice(16, 22), ':'),
            interval: data.readUInt16LE(22) * 1.25,
            latency: data.readUInt16LE(24),
            supervisionTimeout: data.readUInt16LE(26) * 10,
            masterClockAccuracy: data.readUInt8(28), // TODO: multiplier?
        };
    }
    processLeConnComplete(status, data, onConnectCallback) {
        const handle = data.handle;
        const role = data.role;
        const addressType = data.addressType;
        const address = data.address;
        const interval = data.interval;
        const latency = data.latency; // TODO: multiplier?
        const supervisionTimeout = data.supervisionTimeout;
        const masterClockAccuracy = data.masterClockAccuracy; // TODO: multiplier?
        this.debug('\t\t\thandle = ' + handle);
        this.debug('\t\t\trole = ' + role);
        this.debug('\t\t\taddress type = ' + addressType);
        this.debug('\t\t\taddress = ' + address);
        this.debug('\t\t\tinterval = ' + interval);
        this.debug('\t\t\tlatency = ' + latency);
        this.debug('\t\t\tsupervision timeout = ' + supervisionTimeout);
        this.debug('\t\t\tmaster clock accuracy = ' + masterClockAccuracy);
        this._handleAclsInProgress[handle] = 0;
        if (role === 1) {
            // only slave, emit
            this.emit('leConnComplete', status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy);
        }
        const result = {
            status,
            handle,
            role,
            addressType,
            address,
            interval,
            latency,
            supervisionTimeout,
            masterClockAccuracy,
        };
        if (typeof onConnectCallback === 'function') {
            onConnectCallback(result);
        }
        return result;
    }
    phyToStr(phy) {
        switch (phy) {
            case 0:
                return 'noPhy';
            case 1:
                return '1m';
            case 2:
                return '2m';
            case 3:
                return 'coded';
            default:
                return 'error';
        }
    }
    processLeExtendedAdvertisingReport(count, data) {
        for (let i = 0; i < count; i++) {
            const type = data.readUInt16LE(0);
            const addressType = data.readUInt8(2) === 0x01 ? 'random' : 'public';
            const address = bleHelper_1.default.buffer2reversedHex(data.slice(3, 9), ':');
            const primaryPhy = this.phyToStr(data.readUInt8(9));
            const secondaryPhy = this.phyToStr(data.readUInt8(10));
            const sid = data.readUInt8(11);
            const txPower = data.readInt8(12);
            const rssi = data.readInt8(13);
            const periodicAdvertisingInterval = data.readUInt16LE(14);
            const directAddressType = data.readUInt8(16) === 0x01 ? 'random' : 'public';
            const directAddress = bleHelper_1.default.buffer2reversedHex(data.slice(17, 23), ':');
            const eirLength = data.readUInt8(23);
            let eir = data.slice(24, eirLength + 24);
            this.debug('\t\t\ttype = ' + type);
            this.debug('\t\t\taddress = ' + address);
            this.debug('\t\t\taddress type = ' + addressType);
            this.debug('\t\t\teir = ' + eir.toString('hex'));
            this.debug('\t\t\trssi =  ' + rssi);
            this.debug('\t\t\tprimaryPhy =  ' + primaryPhy);
            this.debug('\t\t\tsecondaryPhy =  ' + secondaryPhy);
            this.debug('\t\t\tsid =  ' + sid);
            this.debug('\t\t\ttxPower  ' + txPower);
            this.debug('\t\t\tperiodicAdvertisingInterval  ' + periodicAdvertisingInterval);
            this.debug('\t\t\tdirectAddressType  ' + directAddressType);
            this.debug('\t\t\tdirectAddress  ' + directAddress);
            this.debug('\t\t\teirLength  ' + eirLength);
            if ((type & 0x10) === 0) {
                // レガシー広告ではない
                const dataMode = type >> 5;
                switch (dataMode & 0b11) {
                    case 0:
                        // complete
                        if (this._extendedAdvertiseJoinData[address + sid]) {
                            eir = Buffer.concat([
                                this._extendedAdvertiseJoinData[address + sid].eir,
                                eir,
                            ]);
                            delete this._extendedAdvertiseJoinData[address + sid];
                        }
                        this.debug('\t\t\tcomplete eir = length ' +
                            eir.length +
                            ' message' +
                            eir.toString('hex'));
                        break;
                    case 1: {
                        // 追加データあり
                        if (this._extendedAdvertiseJoinData[address + sid]) {
                            this._extendedAdvertiseJoinData[address + sid].eir = Buffer.concat([
                                this._extendedAdvertiseJoinData[address + sid].eir,
                                eir,
                            ]);
                        }
                        else {
                            this._extendedAdvertiseJoinData[address + sid] = {
                                eir,
                            };
                        }
                        return;
                    }
                    case 2:
                        // エラー追加データなし
                        delete this._extendedAdvertiseJoinData[address + sid];
                        return;
                }
            }
            this.debug('\t\t\ttype = ' + type);
            this.emit('leExtendedAdvertisingReport', 0, type, address, addressType, eir, rssi, primaryPhy, secondaryPhy, sid, txPower, periodicAdvertisingInterval, directAddressType, directAddress);
            data = data.slice(eirLength + 24);
        }
    }
    processLeAdvertisingReport(count, data) {
        for (let i = 0; i < count; i++) {
            const type = data.readUInt8(0);
            const addressType = data.readUInt8(1) === 0x01 ? 'random' : 'public';
            const address = bleHelper_1.default.buffer2reversedHex(data.slice(2, 8), ':');
            const eirLength = data.readUInt8(8);
            const eir = data.slice(9, eirLength + 9);
            const rssi = data.readInt8(eirLength + 9);
            this.debug('\t\t\ttype = ' + type);
            this.debug('\t\t\taddress = ' + address);
            this.debug('\t\t\taddress type = ' + addressType);
            this.debug('\t\t\teir = ' + eir.toString('hex'));
            this.debug('\t\t\trssi =  ' + rssi);
            this.emit('leAdvertisingReport', 0, type, address, addressType, eir, rssi, false);
            data = data.slice(eirLength + 10);
        }
    }
    processCmdStatusEvent(cmd, status) {
        if (cmd === COMMANDS.LE_CREATE_CONN_CMD) {
            if (status !== 0) {
                this.emit('leConnComplete', status);
            }
        }
    }
    async processLeReadBufferSizeWait(result) {
        const aclMtu = result.readUInt16LE(0);
        const aclMaxInProgress = result.readUInt8(2);
        if (!aclMtu) {
            // as per Bluetooth specs
            this.debug('falling back to br/edr buffer size');
            return await this.readBufferSizeWait();
        }
        else {
            this.debug('le acl mtu = ' + aclMtu);
            this.debug('le acl max in progress = ' + aclMaxInProgress);
            this._aclMtu = aclMtu;
            this._aclMaxInProgress = aclMaxInProgress;
        }
    }
    stateChange(state) {
        this._state = state;
        this.emit('stateChange', state);
    }
    async readAclStreamWait(handle, cid, firstData, timeout) {
        return await this._obnizHci.timeoutPromiseWrapper(new Promise((resolve) => {
            const key = (cid << 8) + firstData;
            this._aclStreamObservers[handle] =
                this._aclStreamObservers[handle] || [];
            this._aclStreamObservers[handle][key] = []; // reset: queue is not supported
            this._aclStreamObservers[handle][key].push(resolve);
        }), {
            timeout,
            waitingFor: `readAclStream handle:${handle} cid:${cid} firstData:${firstData}`,
        });
    }
    async readLeMetaEventWait(eventType, options) {
        const filter = this.createLeMetaEventFilter(eventType);
        options = options || {};
        options.waitingFor = `LeMetaEvent ${options.waitingFor} (${JSON.stringify(filter)}, event = ${eventType})`;
        const data = await this._obnizHci.readWait(filter, options);
        const type = data.readUInt8(3);
        const status = data.readUInt8(4);
        const _data = data.slice(5);
        return { type, status, data: _data };
    }
    createLeMetaEventFilter(eventType) {
        return [COMMANDS.HCI_EVENT_PKT, COMMANDS.EVT_LE_META_EVENT, -1, eventType];
    }
    async readCmdCompleteEventWait(requestCmd, additionalResultFilter) {
        additionalResultFilter = additionalResultFilter || [];
        let filter = this.createCmdCompleteEventFilter(requestCmd);
        if (additionalResultFilter.length > 0) {
            filter = [
                ...filter,
                -1,
                ...additionalResultFilter,
            ];
        }
        const options = {};
        options.waitingFor = `CmdCompleteEvent ${JSON.stringify(filter)}(cmd = ${requestCmd})`;
        const data = await this._obnizHci.readWait(filter, options);
        const eventType = data.readUInt8(0);
        const subEventType = data.readUInt8(1);
        const ncmd = data.readUInt8(3);
        const cmd = data.readUInt16LE(4);
        const status = data.readUInt8(6);
        const result = data.slice(7);
        return { eventType, subEventType, ncmd, cmd, status, result };
    }
    createCmdCompleteEventFilter(cmd) {
        return [
            COMMANDS.HCI_EVENT_PKT,
            COMMANDS.EVT_CMD_COMPLETE,
            -1,
            -1,
            (cmd >> 0) & 0xff,
            (cmd >> 8) & 0xff,
        ];
    }
    debug(...args) {
        this.debugHandler(`${args[0]}`);
        // console.debug('debug', args);
    }
    onHciAclData(data) {
        const flags = data.readUInt16LE(1) >> 12;
        const handle = (data.readUInt16LE(1) & 0x0fff);
        if (COMMANDS.ACL_START === flags) {
            const cid = data.readUInt16LE(7);
            const length = data.readUInt16LE(5);
            const pktData = data.slice(9);
            this.debug('\t\tcid = ' + cid);
            if (length === pktData.length) {
                this.debug('\t\thandle = ' + handle);
                this.debug('\t\tdata = ' + pktData.toString('hex'));
                this.emit('aclDataPkt', handle, cid, pktData);
                const key = (cid << 8) + pktData.readUInt8(0);
                if (this._aclStreamObservers[handle] &&
                    this._aclStreamObservers[handle][key] &&
                    this._aclStreamObservers[handle][key].length > 0) {
                    const resolve = this._aclStreamObservers[handle][key].shift();
                    resolve(pktData);
                }
            }
            else {
                this._handleBuffers[handle] = {
                    length,
                    cid,
                    data: pktData,
                };
            }
        }
        else if (COMMANDS.ACL_CONT === flags) {
            if (!this._handleBuffers[handle] || !this._handleBuffers[handle].data) {
                return;
            }
            this._handleBuffers[handle].data = Buffer.concat([
                this._handleBuffers[handle].data,
                data.slice(5),
            ]);
            if (this._handleBuffers[handle].data.length ===
                this._handleBuffers[handle].length) {
                this.emit('aclDataPkt', handle, this._handleBuffers[handle].cid, this._handleBuffers[handle].data);
                const key = (this._handleBuffers[handle].cid << 8) +
                    this._handleBuffers[handle].data.readUInt8(0);
                if (this._aclStreamObservers[handle] &&
                    this._aclStreamObservers[handle][key] &&
                    this._aclStreamObservers[handle][key].length > 0) {
                    const resolve = this._aclStreamObservers[handle][key].shift();
                    resolve(this._handleBuffers[handle].data);
                }
                delete this._handleBuffers[handle];
            }
        }
    }
    onHciEventData(data) {
        const subEventType = data.readUInt8(1);
        this.debug('\tsub event type = 0x' + subEventType.toString(16));
        if (subEventType === COMMANDS.EVT_DISCONN_COMPLETE) {
            const handle = data.readUInt16LE(4);
            const reason = data.readUInt8(6);
            this.debug('\t\thandle = ' + handle);
            this.debug('\t\treason = ' + reason);
            delete this._handleAclsInProgress[handle];
            const aclOutQueue = [];
            let discarded = 0;
            for (const i in this._aclOutQueue) {
                if (this._aclOutQueue[i].handle !== handle) {
                    aclOutQueue.push(this._aclOutQueue[i]);
                }
                else {
                    discarded++;
                }
            }
            if (discarded) {
                this.debug('\t\tacls discarded = ' + discarded);
            }
            this._aclOutQueue = aclOutQueue;
            this.pushAclOutQueue();
            this.emit('disconnComplete', handle, reason);
        }
        else if (subEventType === COMMANDS.EVT_ENCRYPT_CHANGE) {
            const status = data.readUInt8(3);
            const handle = data.readUInt16LE(4);
            const encrypt = data.readUInt8(6);
            if (status === 0) {
                this.debug('\t\thandle = ' + handle);
                this.debug('\t\tencrypt = ' + encrypt);
                this.emit('encryptChange', handle, encrypt);
            }
            else {
                this.debug('\t\tencrypt status = ' + status);
                this.debug('\t\thandle = ' + handle);
                this.debug('\t\tencrypt = ' + encrypt);
                this.emit('encryptChange', handle, encrypt);
            }
        }
        else if (subEventType === COMMANDS.EVT_CMD_COMPLETE) {
            // command complete event are handle each command send functions;
        }
        else if (subEventType === COMMANDS.EVT_CMD_STATUS) {
            const status = data.readUInt8(3);
            const cmd = data.readUInt16LE(5);
            this.debug('\t\tstatus = ' + status);
            this.debug('\t\tcmd = ' + cmd);
            this.processCmdStatusEvent(cmd, status);
        }
        else if (subEventType === COMMANDS.EVT_LE_META_EVENT) {
            const leMetaEventType = data.readUInt8(3);
            const leMetaEventStatus = data.readUInt8(4);
            const leMetaEventData = data.slice(5);
            this.debug('\t\tLE meta event type = ' + leMetaEventType);
            this.debug('\t\tLE meta event status = ' + leMetaEventStatus);
            this.debug('\t\tLE meta event data = ' + leMetaEventData.toString('hex'));
            this.processLeMetaEvent(leMetaEventType, leMetaEventStatus, leMetaEventData);
        }
        else if (subEventType === COMMANDS.EVT_NUMBER_OF_COMPLETED_PACKETS) {
            const handles = data.readUInt8(3);
            for (let i = 0; i < handles; i++) {
                const handle = data.readUInt16LE(4 + i * 4);
                const pkts = data.readUInt16LE(6 + i * 4);
                this.debug('\thandle = ' + handle);
                this.debug('\t\tcompleted = ' + pkts);
                if (this._handleAclsInProgress[handle] === undefined) {
                    this.debug('\t\talready closed');
                    continue;
                }
                if (pkts > this._handleAclsInProgress[handle]) {
                    // Linux kernel may send acl packets by itself, so be ready for underflow
                    this._handleAclsInProgress[handle] = 0;
                }
                else {
                    this._handleAclsInProgress[handle] -= pkts;
                }
                this.debug('\t\tin progress = ' + this._handleAclsInProgress[handle]);
            }
            this.pushAclOutQueue();
        }
    }
    onSocketData(array) {
        const data = Buffer.from(array);
        this.debug('onSocketData: ' + data.toString('hex'));
        // console.log(
        //   'RECV:',
        //   data
        //     .toString('hex')
        //     .match(/.{1,2}/g)!
        //     .join(' ')
        // );
        const eventType = data.readUInt8(0);
        this.debug('\tevent type = 0x' + eventType.toString(16));
        if (COMMANDS.HCI_EVENT_PKT === eventType) {
            this.onHciEventData(data);
        }
        else if (COMMANDS.HCI_ACLDATA_PKT === eventType) {
            this.onHciAclData(data);
        }
    }
    async writeNoParamCommandWait(command, commandName) {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(command, 1);
        // length
        cmd.writeUInt8(0x00, 3);
        const p = this.readCmdCompleteEventWait(command);
        this.debug(`${commandName} - writing: ${cmd.toString('hex')}`);
        this._socket.write(cmd);
        const resetResult = await p;
        return resetResult;
    }
    async writeSingleParamCommandWait(command, param, options, commandName) {
        const cmd = Buffer.alloc(5);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(command, 1);
        // length
        cmd.writeUInt8(0x01, 3);
        if (!(param in options)) {
            throw new ObnizError_1.ObnizParameterError(`${String(param)}`, `BLE HCI ${commandName} param`);
        }
        const val = options[param];
        cmd.writeUInt8(val, 4);
        const p = this.readCmdCompleteEventWait(command);
        this.debug(`${commandName} - writing: ${cmd.toString('hex')}`);
        this._socket.write(cmd);
        const resetResult = await p;
        return resetResult;
    }
}
exports.Hci = Hci;
Hci.STATUS_MAPPER = hci_status_json_1.default;
