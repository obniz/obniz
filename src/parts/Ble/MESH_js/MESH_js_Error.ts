export class MESH_js_Error extends Error {
  constructor(public code: number, e?: string) {
    super(e);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MESHOutOfRangeError extends MESH_js_Error {
  constructor(public property: string, min?: number, max?: number) {
    super(
      1,
      property +
        ' is out of range. ' +
        (min !== void 0 && max !== void 0
          ? property + ' must be ' + min + ' ~ ' + max + '.'
          : '')
    );
  }
}

export class MESHInvalidValue extends MESH_js_Error {
  constructor(public property: string) {
    super(2, property + 'is invalid value.');
  }
}
