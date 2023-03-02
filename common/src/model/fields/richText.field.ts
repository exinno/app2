import { FieldModel, View } from '..';

/** Rich text field */
@View({
  name: 'richTextField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class RichTextFieldModel extends FieldModel {
  declare type: 'RichTextField';

  name? = 'RichTextField';

  icon? = 'mdi-text-box-edit';

  dataType? = 'string' as const;

  columnType? = 'text' as const;

  editorBorder?: string;

  cols? = 12;
}
