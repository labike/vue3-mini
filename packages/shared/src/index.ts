export const isArray = Array.isArray

export const isObject = (val: unknown) => val !== null && typeof val === 'object';

export const hashChange = (value: any, oldValue: any): boolean => !Object.is(value, oldValue);