export class MeshJsError extends Error {
  constructor(public code: number, e?: string) {
    super(e);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MeshBlockVersionError extends MeshJsError {
  constructor(public major: number, minor: number, release: number) {
    super(
      1,
      'please UPDATE block version to 1.2.5 more. (current block version ' +
        major +
        '.' +
        minor +
        '.' +
        release +
        ')'
    );
  }
}

export class MeshJsOutOfRangeError extends MeshJsError {
  constructor(public property: string, min: number, max: number) {
    super(
      2,
      property +
        ' is out of range. ' +
        property +
        ' must be ' +
        min +
        ' ~ ' +
        max +
        '.'
    );
  }
}

export class MeshJsInvalidValueError extends MeshJsError {
  constructor(public property: string) {
    super(3, property + ' is invalid value.');
  }
}

export class MeshJsTimeOutError extends MeshJsError {
  constructor(public property: string) {
    super(4, property + ' is time out.');
  }
}
