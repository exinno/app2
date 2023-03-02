import { FieldModel, View } from '..';

/** JSON field */
@View({
  name: 'jsonField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class JsonFieldModel extends FieldModel {
  declare type: 'JsonField';

  name? = 'JsonField';

  icon? = 'mdi-code-json';

  dataType? = 'object' as const;

  columnType? = 'text' as const;

  cols? = 12;
}
