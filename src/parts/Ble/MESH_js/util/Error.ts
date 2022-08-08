export class MESHJsError extends Error {
  constructor(public code: number, e?: string) {
    super(e);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MESHJsBlockVersionError extends MESHJsError {
  constructor(public major: number, minor: number, release: number) {
    super(
      1,
      'Please UPDATE the block software to version 1.2.5 or higher. (Current block software version is ' +
        major +
        '.' +
        minor +
        '.' +
        release +
        ' .)'
    );
  }
}

export class MESHJsOutOfRangeError extends MESHJsError {
  constructor(public property: string, min: number, max: number) {
    super(
      2,
      property +
        ' is out of range. ' +
        property +
        ' must be ' +
        min +
        '-' +
        max +
        '.'
    );
  }
}

export class MESHJsInvalidValueError extends MESHJsError {
  constructor(public property: string) {
    super(3, property + ' is invalid value.');
  }
}

export class MESHJsTimeOutError extends MESHJsError {
  constructor(public property: string) {
    super(4, property + ' is time out.');
  }
}
