import { dictPropField, Field, FieldModel, View } from '..';

/** Color field */
@View({
  name: 'colorField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class ColorFieldModel extends FieldModel {
  declare type: 'ColorField';

  name? = 'ColorField';

  icon? = 'mdi-palette';

  dataType? = 'string' as const;

  columnType? = 'string' as const;

  cellStyle? = { 'text-align': 'center' };

  defaultValue? = '#000000';
  /** Text style to use in the field.  */
  @Field(dictPropField)
  textStyle? = { 'padding-left': '5px' };
}
