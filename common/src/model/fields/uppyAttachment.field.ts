import { FieldModel, View } from '..';
import { Field } from '../models/model.decorator';

const plugins = <const>['ScreenCapture', 'Webcam', 'Audio'];

/** Attachment field */
@View({
  name: 'uppyAttachmentField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'maxFileSize', 'allowedFileTypes', 'storageId']
})
export class UppyAttachmentFieldModel extends FieldModel {
  declare type: 'UppyAttachmentField';

  name? = 'UppyAttachmentField';

  icon? = 'mdi-attachment';

  dataType? = 'array' as const;

  columnType? = 'string' as const;

  /** Whether to allow thumbnails or not. */
  @Field({ type: 'CheckboxField' })
  thumbnail?: boolean;

  /** It defines maximum file size in bytes for each individual file. */
  @Field({ type: 'NumberField' })
  maxFileSize?: number;

  /** It defines maximum file size in bytes for all the files that can be selected for upload. */
  @Field({ type: 'NumberField' })
  maxTotalFileSize?: number;

  /** It defines total number of files that can be selected. */
  @Field({ type: 'NumberField' })
  maxNumberOfFiles?: number;

  /** It defines exact mime types image/jpeg, or file extensions .jpg: ['image/*', '.jpg', '.jpeg', '.png', '.gif'] */
  // 보안 관련 이슈로 타입은 필수로..
  @Field({ type: 'StringField' })
  allowedFileTypes: string[];

  /** ID of storage to store files */
  @Field({ type: 'LookupField', relatedView: 'storages', defaultValue: 'default' })
  storageId?: string;

  /** Plugins are available such as 'ScreenCapture', 'Webcam', 'Audio'.
   * TODO plugins not working. */
  @Field({
    type: 'SelectField',
    optionItems: plugins,
    multiple: false
  })
  plugins?: typeof plugins[number];

  cols? = 12;
}
