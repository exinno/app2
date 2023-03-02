import toSource from './toSource';

class JsSerializer {
  serialize(data: any, options?: { ignoreStartsWith?: string }) {
    const result = toSource(data, options?.ignoreStartsWith);

    return result;
  }

  deserialize(source: string): any {
    source = source.trim();
    if (!source) return undefined;
    if (source.endsWith(';')) source = source.substring(0, source.length - 1);
    try {
      return eval('(' + source + ')');
    } catch (err) {
      console.error(source);
      throw err;
    }
  }
}

export const jsSerializer = new JsSerializer();
