import { FieldModel, Field, View } from '..';

/** Image Editor field */
@View({
  name: 'imageEditorField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'width', 'height', 'saveWidth', 'saveHeight', 'crop', 'emptyImage']
})
export class ImageEditorFieldModel extends FieldModel {
  declare type: 'ImageEditorField';

  name? = 'ImageEditorField';

  icon? = 'mdi-image-edit';

  dataType? = 'string' as const;

  columnType? = 'text' as const;

  @Field()
  width?: string;

  @Field()
  height?: string;

  @Field()
  crop?: 'Circle' | 'Square' | 'Custom' | '4:3' | '16:9';

  @Field()
  saveWidth?: number;

  @Field()
  saveHeight?: number;

  @Field()
  emptyImage?: string;
}
