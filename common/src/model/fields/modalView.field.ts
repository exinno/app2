import { Field, FieldModel, OpenSize, AnyViewModel, View } from '..';

/** Modal view field */
@View({
  name: 'modalViewField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'view']
})
export class ModalViewFieldModel extends FieldModel {
  declare type: 'ModalViewField';

  name? = 'ModalViewField';

  icon? = 'mdi-dock-window';

  openSize?: OpenSize;

  view?: AnyViewModel | string;

  /** Whether to allow updating value in modal.
   * TODO check */
  @Field({ type: 'CheckboxField' })
  noUpdateData?: boolean;
}
