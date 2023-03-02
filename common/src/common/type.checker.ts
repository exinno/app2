export function isNumber(x: any): x is number {
  return typeof x === 'number';
}

export function isString(x: any): x is string {
  return typeof x === 'string';
}

export function isBoolean<T>(x: any): x is boolean {
  return typeof x === 'boolean';
}

export function isArray<T>(x: any): x is any[] {
  return Array.isArray(x);
}

export function isDefined<T>(argument: T | undefined | null): argument is T {
  return argument !== undefined && argument !== null;
}

export function isPromise<T = any>(x: any): x is Promise<T> {
  return x && typeof x.then == 'function';
}
