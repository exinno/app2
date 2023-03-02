import prettier from 'prettier';
import parser from 'prettier/parser-babel';

export function formatJs(source: string) {
  const prettierOptions: prettier.Options = {
    singleQuote: true,
    semi: true,
    trailingComma: 'none',
    parser: 'babel',
    printWidth: 120,
    plugins: [parser]
  };
  if (!source) return source;
  try {
    return prettier.format(source, prettierOptions);
  } catch (e) {
    console.warn(source);
    console.warn(e);
    return source;
  }
}
