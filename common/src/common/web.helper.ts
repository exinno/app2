import { Dict } from '../data';
import { parseJSONSafe } from './common.helper';
import { isNumber, isString } from './type.checker';

export function getQueryObject(href: string = location.href): Dict {
  const search = href.slice(href.indexOf('?'), href.length);
  const params = new URLSearchParams(search);
  const result = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
export function toPx(value?: string | number): string {
  let px: string;
  if (!value) return '';
  if (isNumber(value) || /^\d+$/.test(value)) px = value + 'px';
  else px = value;
  px += ' !important';

  return px;
}

export function downloadFile(url: string, fileName?: string) {
  const link = document.createElement('a');

  if (fileName) link.download = fileName;
  link.href = url;
  link.setAttribute('style', 'display: none');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function uploadFile(
  onChange: (event: Event & { target: HTMLInputElement }) => void,
  type: 'none' | 'camera' = 'none'
) {
  const input = document.createElement('input');

  input.setAttribute('type', 'file');
  input.setAttribute('style', 'display: none');
  input.setAttribute('multiple', '');

  if (type === 'camera') {
    input.setAttribute('accept', 'image/*');
    input.setAttribute('capture', 'camera/*');
  }

  input.addEventListener('change', onChange);
  document.body.appendChild(input);

  input.click();

  document.body.removeChild(input);
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = function () {
      resolve(reader.result as string);
    };
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const result = await fetch(dataUrl);
  const blob = await result.blob();

  return blob;
}

export async function imageDataToDataUrl(imageData: ImageData): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL('image/png', 0.9);
}

export async function dataUrlToImageData(url: string): Promise<ImageData> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvasElement = document.createElement('canvas');
      canvasElement.width = image.width;
      canvasElement.height = image.height;
      const context = canvasElement.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      resolve(context.getImageData(0, 0, image.width, image.height));
    };
    image.src = url;
    image.style.display = 'none';
    document.body.appendChild(image);
  });
}

export async function blobToImageData(blob: Blob): Promise<ImageData> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvasElement = document.createElement('canvas');
      canvasElement.width = image.width;
      canvasElement.height = image.height;
      const context = canvasElement.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      resolve(context.getImageData(0, 0, image.width, image.height));
    };
    image.src = URL.createObjectURL(blob);
    image.style.display = 'none';
    document.body.appendChild(image);
  });
}

export function scrollBottom(target: HTMLElement, afterMs = 0) {
  if (!target) return;
  setTimeout(() => {
    target.scrollTop = target.scrollHeight;
  }, afterMs);
}

export function createProxyStorage<T extends object = Dict>(prefix: string): T {
  return new Proxy<T>({} as T, {
    set: (obj, prop: string, value: any): boolean => {
      if (!isString(prop)) return;
      const key = `${prefix}.${prop}`;
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    get: (obj, prop: string) => {
      if (!isString(prop)) return;
      const value = localStorage.getItem(`${prefix}.${prop}`);
      return parseJSONSafe(value);
    }
  });
}
