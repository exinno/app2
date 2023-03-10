import { FieldModel } from '..';
import { View } from '../models/model.decorator';

/** Custom field */
@View({
  name: 'customField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'component']
})
export class CustomFieldModel extends FieldModel {
  declare type?: 'CustomField';

  name? = 'CustomField';

  icon? = 'mdi-file-question';

  component?: string;
}
