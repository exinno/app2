import { FieldModel, View } from '..';

/** Icon field */
@View({
  name: 'iconField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class IconFieldModel extends FieldModel {
  declare type: 'IconField';

  name? = 'IconField';

  icon? = 'mdi-vector-square';

  dataType? = 'number' as const;

  columnType? = 'string' as const;
}
