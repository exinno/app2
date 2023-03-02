import { AnyViewModel } from 'app2-common';

const list: AnyViewModel[] = [
  { name: 'chatbot', type: 'ChatbotView' },
  {
    type: 'DataGridView',
    datasource: 'default',
    name: 'test1',
    keyField: 'ID',
    parentMenu: 'myViews',
    table: 'BPS_PRODUCT',
    fields: [
      { name: 'ID', label: '상품 ID', type: 'StringField', notNull: true, required: true },
      { name: 'NAME5', label: 'Name5', type: 'StringField', notNull: false, required: false },
      { name: 'HQ_ITEM_CODE', label: 'Item Code', type: 'StringField', notNull: false, required: false },
      { name: 'SUPPLIER_CODE', label: 'Supplier', type: 'StringField', notNull: false, required: false },
      { name: 'HQ_CUSTOMER_CODE', label: 'Customer Code', type: 'StringField', notNull: false, required: false },
      { name: 'CURRENCY', label: 'Currency', type: 'StringField', notNull: false, required: false },
      { type: 'SheetField', name: 'sheet' }
    ]
  },
  {
    type: 'DataGridView',
    datasource: 'default',
    name: 'interestRate',
    parent: 'editable',
    label: '기준금리',
    icon: 'mdi-currency-usd',
    parentMenu: 'myViews',
    table: 'test_interest_rate',
    fields: [
      { name: '기준일', label: '기준일', type: 'StringField' },
      { name: 'CD금리(3개월)', label: 'CD금리(3개월)', type: 'StringField' },
      { name: 'COFIX신잔액', label: 'COFIX신잔액', type: 'StringField' },
      { name: 'COFIX신규취급액', label: 'COFIX신규취급액', type: 'StringField' },
      { name: 'COFIX잔액', label: 'COFIX잔액', type: 'StringField' },
      { name: '국고채2년물', label: '국고채2년물', type: 'StringField' },
      { name: 'GVRN_BOND_3_YR_INT', label: 'GVRN_BOND_3_YR_INT', type: 'StringField' },
      { name: 'GVRN_BOND_4_YR_INT', label: 'GVRN_BOND_4_YR_INT', type: 'StringField' },
      { name: 'GVRN_BOND_5_YR_INT', label: 'GVRN_BOND_5_YR_INT', type: 'StringField' },
      { name: 'GVRN_BOND_1_YR_INT', label: 'GVRN_BOND_1_YR_INT', type: 'StringField' },
      { name: 'FNANCL_BOND_5_YR_EXPIRE', label: 'FNANCL_BOND_5_YR_EXPIRE', type: 'StringField' },
      { name: 'COFIX단기', label: 'COFIX단기', type: 'StringField' },
      { name: 'FNANCL_BOND_3_YR_EXPIRE', label: 'FNANCL_BOND_3_YR_EXPIRE', type: 'StringField' },
      { name: 'FNANCL_BOND_2_YR_EXPIRE', label: 'FNANCL_BOND_2_YR_EXPIRE', type: 'StringField' },
      { name: 'Call금리', label: 'Call금리', type: 'StringField' },
      { name: 'FNANCL_BOND_1_YR_EXPIRE', label: 'FNANCL_BOND_1_YR_EXPIRE', type: 'StringField' }
    ]
  }
];

export default list;
