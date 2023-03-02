import { Field, FieldModel, View } from '../';
import { ScreenSize } from '../../ui';

/** Action field */
@View({
  name: 'actionField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'actionSize', 'noEllipsis', 'hideLabel', 'laidCount']
})
export class ActionFieldModel extends FieldModel {
  declare type: 'ActionField';

  name? = 'ActionField';

  icon? = 'mdi-button-pointer';

  @Field()
  actionSize?: ScreenSize;

  @Field()
  noEllipsis?: boolean;

  @Field()
  hideLabel?: boolean;

  @Field()
  laidCount?: number;
}
