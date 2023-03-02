import { AnyViewModel, Field, FieldModel, PropOptions, View } from '..';

/** Video field */
@View({
  name: 'viewField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'view']
})
export class ViewFieldModel extends FieldModel {
  declare type?: 'ViewField';

  name? = 'ViewField';

  icon? = 'mdi-monitor';

  @Field({
    type: 'PropField',
    propType: 'AnyViewModel | string | (options: PropOptions<any>) => AnyViewModel | string'
  })
  view?: AnyViewModel | string | (<T extends this>(options: PropOptions<T>) => AnyViewModel | string);

  /** Whether to show action buttons in side of detail view*/
  @Field({ type: 'CheckboxField' })
  verticalAction?: boolean = false;

  cols? = 12;
}
