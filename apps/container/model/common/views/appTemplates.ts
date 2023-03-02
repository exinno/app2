import { Field, View } from 'app2-common';

@View({
  name: 'appTemplates',
  type: 'DataGridView',
  table: 'OcAppTemplate',
  keyField: 'name',
  labelField: 'title',
  updatedAtField: 'updatedAt',
  updatedByField: 'updatedBy',
  createdByField: 'owner',
  orderBy: [{ field: 'updatedAt', direction: 'desc' }],
  columnFields: ['name', 'title', 'owner', 'updatedAt'],
  live: true
})
export class AppTemplate {
  @Field({ label: 'Name', type: 'StringField', required: true })
  name?: string;

  @Field()
  title?: string;

  @Field({ type: 'LookupField', relatedView: 'users', editable: false, creatable: false })
  owner?: any;

  @Field({ type: 'DateField', dateType: 'dateTime', editable: false, creatable: false })
  updatedAt?: Date;

  @Field({ type: 'LookupField', relatedView: 'users', editable: false, creatable: false })
  updatedBy?: any;

  @Field({ type: 'StringField', cols: 12 })
  declare description?: string;
}
