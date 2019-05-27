/** @format */

export class Optional<T> {
  private _value: any;

  constructor(val: any) {
    this._value = val;
  }

  public unwrap(onNull?: () => void): T {
    if (this.isNull) {
      if (onNull) onNull();
      else throw new Error('value is null');
    }
    return this._value;
  }

  public get val(): T {
    return this._value;
  }

  public get isNull(): boolean {
    return this._value === null || this._value === undefined;
  }
}
