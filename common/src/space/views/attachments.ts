import { View, Field, Editable, ViewFieldModel } from '../..';

@View({
  name: 'attachments',
  table: 'OcAttachment',
  parent: 'editable',
  acl: 'authAny',
  ownerField: 'createdBy',
  type: 'DataGridView'
})
export class Attachment extends Editable {
  @Field({ type: 'StringField', required: true })
  dataView: string; // tasks (serverView)

  @Field({ type: 'StringField', required: true })
  dataId: string; // task.id

  @Field({ type: 'StringField', required: true })
  attachView: string; // files

  @Field({ type: 'StringField', required: true })
  attachField: ViewFieldModel | string; // fileAttachments

  @Field({ type: 'StringField', required: true })
  attachedId: string; // file.id
}
