export interface MFRC522Options {
	gnd?: number;
	vcc?: number;
	cs: number;
	clk?: number
	mosi: number;
	miso: number;
	spi?: number;
	spi_frequency?: number;
	pull?: any;
	rst: number;
}

export interface MFRC522 {
	init(): Promise<void>;
	writeRegister(addr: any, val: any): void;
	readRegister(addr: any): Promise<any>;
	readRegister_nByte(addr: any, n: any): Promise<any>;
	setRegisterBitMask(reg: any, mask: any): Promise<void>;
	clearRegisterBitMask(reg: any, mask: any): Promise<void>;
	antennaOn(): Promise<void>;
	antennaOff(): Promise<void>;
	toCard(command: any, bitsToSend: any): Promise<{
		status: boolean;
		data: any;
		bitSize: number;
	}>;
	findCardWait(): Promise<{
		uid: any;
		PICC_Type: string;
	}>;
	searchTagWait(): Promise<void>;
	getUidWait(): Promise<any>;
	calculateCRCWait(data: any): Promise<any>;
	identifySoftwareWait(): Promise<any>;
	identifyCardTypeWait(uid: any): Promise<string>;
	readSectorDataWait(Sector: any, uid: any): Promise<any[]>;
	readBlockDatWaita(Block: any, uid: any): Promise<{
		status: boolean;
		data: any;
		bitSize: number;
	}>;
	authenticateSectorWait(Sector: any, uid: any): Promise<void>;
	authenticateBlockWait(Block: any, uid: any): Promise<void>;
	readAgainWait(): Promise<void>;
	getSectorDataWait(address: any): Promise<any[]>;
	getBlockDataWait(address: any): Promise<{
		status: boolean;
		data: any;
		bitSize: number;
	}>;
	appendCRCtoBufferAndSendToCardWait(buffer: any): Promise<{
		status: boolean;
		data: any;
		bitSize: number;
	}>;
	writeBlockDataWait(address: any, sixteenBytes: any): Promise<{
		data: any;
	}>;
}