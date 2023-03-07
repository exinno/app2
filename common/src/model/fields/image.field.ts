import { FieldModel, Field, dictPropField, View } from '..';
import { Dict } from 'index';

const fitModes = ['cover', 'fill', 'contain', 'none', 'scale-down'] as const;
const crossOriginModes = ['use-credentials', 'anonymous'] as const;
const decodingModes = ['sync', 'async', 'auto'] as const;
const loadingModes = ['lazy', 'eager'] as const;

/** Image field */
@View({
  name: 'imageField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'width', 'height', 'emptyImage']
})
export class ImageFieldModel extends FieldModel {
  declare type: 'ImageField';

  name? = 'ImageField';

  icon? = 'mdi-image';

  dataType? = 'string' as const;

  columnType? = 'string' as const;

  @Field()
  width?: string;

  @Field()
  height?: string;

  @Field()
  emptyImage?: string;

  @Field()
  sizes?: string;

  @Field()
  position?: string;

  @Field()
  ratio?: string | number;

  @Field()
  imageClass?: string;

  @Field(dictPropField)
  imageStyle?: Dict;

  @Field({ type: 'CheckboxField' })
  noSpinner?: boolean;

  @Field()
  spinnerColor?: string;

  @Field()
  spinnerSize?: string;

  @Field({ type: 'CheckboxField' })
  draggable?: boolean;

  @Field()
  placeholderSrc?: string;

  @Field()
  srcset?: string;

  @Field()
  alt?: string;

  @Field({
    type: 'SelectField',
    optionItems: fitModes,
    multiple: false
  })
  fit?: typeof fitModes[number];

  @Field({
    type: 'SelectField',
    optionItems: crossOriginModes,
    multiple: false
  })
  crossOrigin?: typeof crossOriginModes[number];

  @Field({
    type: 'SelectField',
    optionItems: decodingModes,
    multiple: false
  })
  decoding?: typeof decodingModes[number];

  @Field({
    type: 'SelectField',
    optionItems: loadingModes,
    multiple: false
  })
  loading?: typeof loadingModes[number];
}

export const isImageField = (field: any): field is ImageFieldModel =>
  field.type == 'ImageField' || field.type == 'ImageEditorField';
