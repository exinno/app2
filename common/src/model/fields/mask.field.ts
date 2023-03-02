import { Field, FieldModel, View } from '..';

/** Mask field */
@View({
  name: 'maskField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'mask', 'defaultValue']
})
export class MaskFieldModel extends FieldModel {
  declare type: 'MaskField';

  name? = 'MaskField';

  icon? = 'mdi-form-textbox-password';

  dataType? = 'number' as const;

  columnType? = 'string' as const;

  /** Mask field is an enhanced input field that improves readability by providing visual and non-visual cues to a user about the expected value.
   *  Mask property should be written with '0' and '-'. Such as '000-000-0000'. */
  @Field({ type: 'StringField' })
  mask: string;

  /** Placeholder is a string of characters that temporarily takes the place of the final data.*/
  @Field({ type: 'StringField' })
  placeholder?: string;
}
