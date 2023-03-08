import { View, Field, Owned } from '../..';

@View({
  name: 'storages',
  table: 'OcStorage',
  parent: 'owned',
  acl: 'authRead',
  labelField: 'id',
  columnFields: ['name', 'provider']
})
export class Storage extends Owned {
  @Field({ type: 'StringField', required: true })
  provider: string;

  @Field({ type: 'StringField' })
  path: string;
}
