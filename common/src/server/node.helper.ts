import callsite from 'callsite';
import path from 'path';

export function resolveModule(moduleName) {
  if (moduleName[0] === '.') {
    const stack = callsite();
    for (const i in stack) {
      const filename = stack[i].getFileName();
      if (filename !== module.filename) {
        moduleName = path.resolve(path.dirname(filename), moduleName);
        break;
      }
    }
  }
  try {
    return require.resolve(moduleName);
  } catch (e) {
    return;
  }
}

export function importNocache(module: string) {
  const resolvedModule = resolveModule(module);
  delete require.cache[resolvedModule];
  return require(module);
}
