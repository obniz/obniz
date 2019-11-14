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
	RST: number;
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
	findCard(): Promise<{
		uid: any;
		PICC_Type: string;
	}>;
	searchTag(): Promise<void>;
	getUid(): Promise<any>;
	calculateCRC(data: any): Promise<any>;
	identifySoftware(): Promise<any>;
	identifyCardType(uid: any): Promise<string>;
	readSectorData(Sector: any, uid: any): Promise<any[]>;
	readBlockData(Block: any, uid: any): Promise<{
		status: boolean;
		data: any;
		bitSize: number;
	}>;
	authenticateSector(Sector: any, uid: any): Promise<void>;
	authenticateBlock(Block: any, uid: any): Promise<void>;
	readAgain(): Promise<void>;
	getSectorData(address: any): Promise<any[]>;
	getBlockData(address: any): Promise<{
		status: boolean;
		data: any;
		bitSize: number;
	}>;
	appendCRCtoBufferAndSendToCard(buffer: any): Promise<{
		status: boolean;
		data: any;
		bitSize: number;
	}>;
	writeBlockData(address: any, sixteenBytes: any): Promise<{
		data: any;
	}>;
}