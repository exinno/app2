import { FieldModel, PropOptions, View } from '..';

/** Label field */
@View({
  name: 'labelField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class LabelFieldModel extends FieldModel {
  declare type: 'LabelField';

  name? = 'LabelField';

  icon?: string | ((options: PropOptions<any>) => string) = 'mdi-label';

  dataType? = 'string' as const;
}
