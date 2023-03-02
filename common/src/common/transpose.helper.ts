/*
const from = [
  { id: 1, product: 'Occam3', customer: 'Apple', month: '2023-01', sales: 100, profit: 10 },
  { id: 2, product: 'App2', customer: 'Apple', month: '2023-02', sales: 200, profit: 20 },
  { id: 3, product: 'Occam3', customer: 'Google', month: '2023-01', sales: 300, profit: 30 },
  { id: 4, product: 'Occam3', customer: 'Google', month: '2023-02', sales: 400, profit: 40 }
];

const to = [
  { product: 'Occam3', customer: 'Apple', 'id$2023-01': 1, 'sales$2023-01': 100, 'profit$2023-01': 10 },
  { product: 'App2', customer: 'Apple', 'id$2023-02': 2, 'sales$2023-02': 200, 'profit$2023-02': 20 },
  {
    product: 'Occam3',
    customer: 'Google',
    'id$2023-01': 3, 
    'sales$2023-01': 300,
    'profit$2023-01': 30,
    'id$2023-02': 4, 
    'sales$2023-02': 400,
    'profit$2023-02': 40
  }
];

describe('transpose', () => {
  test('transpose data', () => {
    expect(transpose(from, ['product', 'customer'], 'month', ['id', 'sales', 'profit'])).toEqual(to);
  });
});
*/
export function transpose(from: any[], groupKeys: string[], pivotKey: string, pivotValues: string[]) {
  const groups = {};
  const to = [];

  // Group records by groupKeys
  from.forEach((record) => {
    const groupKey = groupKeys.map((key) => record[key]).join('$');
    if (!groups[groupKey]) {
      groups[groupKey] = {};
      groupKeys.forEach((key) => {
        groups[groupKey][key] = record[key];
      });
    }
  });

  // Create new records
  Object.keys(groups).forEach((groupKey) => {
    const record = { ...groups[groupKey] };
    from.forEach((fromRecord) => {
      const groupKeyMatch = groupKeys.every((key) => fromRecord[key] === record[key]);
      if (groupKeyMatch) {
        pivotValues.forEach((pivotValue) => {
          const pivotValueKey = `${pivotValue}$${fromRecord[pivotKey]}`;
          record[pivotValueKey] = fromRecord[pivotValue];
        });
      }
    });
    to.push(record);
  });

  return to;
}

export function getTransposeKey(keyField: string, valueField: string, obj: any) {
  const key = keyField + valueField.substring(valueField.indexOf('$'));
  return obj[key];
}
