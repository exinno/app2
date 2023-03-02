import { Field, FieldModel, View } from '..';

/** Sheet field */
@View({
  name: 'sheetField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'tableDataField', 'saveAsTableData', 'defaultValue']
})
export class SheetFieldModel extends FieldModel {
  declare type: 'SheetField';

  name? = 'SheetField';

  icon? = 'mdi-table-large';

  dataType? = 'array' as const;

  columnType? = 'text' as const;

  /** Will you save the data entered in the sheet as an data table of object array type? The first row should be a column header. Cell style is not stored. If false store the whole sheet data, including a style.  */
  @Field()
  saveAsTableData?: boolean;

  /** Field to save the data table separately. If saveAsTableData is true, this is ignored. */
  @Field()
  tableDataField?: string;

  cols? = 12;
}
