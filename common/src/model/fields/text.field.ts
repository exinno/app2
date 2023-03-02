import { FieldModel, View } from '..';

/** Text field */
@View({
  name: 'textField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class TextFieldModel extends FieldModel {
  declare type: 'TextField';

  name? = 'TextField';

  icon? = 'mdi-text';

  dataType? = 'string' as const;

  columnType? = 'text' as const;

  cols? = 12;
}
