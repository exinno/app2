import { nanoid } from 'nanoid';
import { Dict } from '../data';
import { isArray } from './type.checker';

export function randomString(size = 21): string {
  return nanoid(size);
}

export function replaceObject(toObj: any, fromObj: any, ignoreStartsWith?: string): any {
  if (toObj === fromObj) throw new Error('Attempts to replaceObject on the same object');
  for (const key in toObj) {
    if (!ignoreStartsWith || !key.startsWith(ignoreStartsWith)) delete toObj[key];
  }
  return Object.assign(toObj, fromObj);
}

export function assignObjectNotExist(toObj: any, fromObj: any) {
  if (!fromObj) return toObj;
  for (const key of Object.keys(fromObj)) {
    toObj[key] ??= fromObj[key];
  }
  return toObj;
}

export function formatString(str: string, params?: Dict, removeUnmatched = true): string {
  return str?.replace(/\${([a-zA-Z0-9_]*)}/g, function (match, key) {
    return typeof params?.[key] != 'undefined' ? params[key] : removeUnmatched ? '' : match;
  });
}

export function dotToNested(obj: any) {
  const result = {};

  // For each object path (property key) in the object
  for (const objectPath in obj) {
    // Split path into component parts
    const parts = objectPath.split('.');

    // Create sub-objects along path as needed
    let target = result;
    while (parts.length > 1) {
      const part = parts.shift();
      // lookup field가 LookupField인데 다른 depth로 중복 select된 경우
      if (target[part] && typeof target[part] != 'object') target[part] = { $id: target[part] };
      target = target[part] = target[part] || {};
    }

    // Set value at end of path
    if (typeof target[parts[0]] != 'object') target[parts[0]] = obj[objectPath];
    else if (target[parts[0]] && typeof target[parts[0]] == 'object' && objectPath.split('.').length > 1)
      Object.assign(target[parts[0]], obj[objectPath]);
  }

  return result;
}

export function parseJSON(str: string) {
  return JSON.parse(str, (key, value) =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(-\d{2}:\d{2}|Z)?/.test(value)
      ? new Date(value)
      : value
  );
}

export function parseJSONSafe(str: any): any {
  try {
    return parseJSON(str);
  } catch {
    return str;
  }
}

export function removeStartsWith<T>(object: T, searchString: string): T {
  for (const key in object) {
    if (key.startsWith(searchString)) {
      delete object[key];
    } else if (typeof object[key] == 'object') {
      removeStartsWith(object[key], searchString);
    }
  }
  return object;
}

/**
 * Extract the string between startToken and endToken from str.
 * @param str
 * @param startToken
 * @param endToken
 * @returns
 */
export function extractString(str: string, startToken: string, endToken: string) {
  const startingPos = str.indexOf(startToken);
  if (startingPos == -1) return null;
  const startedPos = startingPos + startToken.length;
  const endPos = str.indexOf(endToken, startedPos);
  if (endPos == -1) return null;
  return str.substring(startedPos, endPos);
}

export function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

export function asArray<T>(data: T | T[]): T[] {
  if (data == null) return null;
  return isArray(data) ? data : [data];
}

export function asSingle<T>(data: T | T[], allowMultiple = false): T {
  if (isArray(data)) {
    if (!allowMultiple && data.length > 1) throw new Error(`Only one item can be handled. length is ${data.length}`);
    return data[0];
  } else {
    return data;
  }
}

const langRegex = {
  ko: /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/,
  ja: /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/,
  zh: /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9]/,
  ru: /[\u0400-\u04FF]|[\u0500-\u052F]/,
  ar: /[\u0600-\u06FF]|[\u0750-\u077F]/,
  en: /[A-Za-z]/
} as const;

type SupportedLang = keyof typeof langRegex;

export function containsLang(lang: SupportedLang, text: string): boolean {
  if (text === null || text === undefined || text === '') return false;
  return !!text.match(langRegex[lang]);
}

export function detectLang(text: string): SupportedLang {
  for (const lang of Object.keys(langRegex) as SupportedLang[]) {
    if (containsLang(lang, text)) return lang;
  }
  return undefined;
}

export function formatBytes(bytes, decimals = 0) {
  if (bytes == null) return '';
  if (isNaN(bytes)) return bytes;

  if (bytes === 0) return '0 Byte';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
