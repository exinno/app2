import { Dict } from '..';
import * as csv from 'fast-csv';
import fs from 'fs-extra';
import path from 'path';
import { Stream } from 'stream';

export async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
}

export function touchFile(path: string) {
  if (!fs.existsSync(path)) fs.closeSync(fs.openSync(path, 'w'));
}

export function loadCsv(filePath: string): Promise<Dict[]> {
  const records = [];
  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(path.resolve(filePath))
        .on('error', (error) => reject(error))
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => reject(error))
        .on('data', (row) => records.push(row))
        .on('end', (rowCount: number) => resolve(records));
    } catch (error) {
      reject(error);
    }
  });
}

export function streamToPromise(stream: Stream) {
  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(undefined));
    stream.on('finish', () => resolve(undefined));
  });
}

// reads a list of all files under a specific directory and returns it as an array
export function getAllFiles(dir: string, fileList = []): string[] {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}
