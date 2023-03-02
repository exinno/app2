import { FieldModel, View } from '..';

/** Video field */
@View({
  name: 'videoField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class VideoFieldModel extends FieldModel {
  declare type: 'VideoField';

  name? = 'VideoField';

  icon? = 'mdi-movie-play';

  dataType? = 'string' as const;

  columnType? = 'string' as const;
}
