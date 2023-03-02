import { View, Field } from '../model/model.decorator';
import { User } from '..';

@View({
  name: 'recordable',
  type: 'DataGridView',
  keyField: 'id',
  createdAtField: 'createdAt',
  createdByField: 'createdBy',
  live: true,
  keyGenerator: 'random'
})
export class Recordable {
  @Field({ label: 'Id', type: 'StringField', editable: false, creatable: false, hidden: true })
  id?: string;

  @Field({ label: 'Created', type: 'DateField', editable: false, creatable: false })
  createdAt?: Date;

  @Field({
    label: 'Created By',
    type: 'LookupField',
    relatedView: 'users',
    editable: false,
    creatable: false
  })
  createdBy?: User | string;
}

@View({
  name: 'editable',
  parent: 'recordable',
  updatedAtField: 'updatedAt',
  updatedByField: 'updatedBy'
})
export class Editable extends Recordable {
  @Field({ label: 'Updated', type: 'DateField', editable: false, creatable: false })
  updatedAt?: Date;

  @Field({
    label: 'Updated By',
    type: 'LookupField',
    relatedView: 'users',
    editable: false,
    creatable: false
  })
  updatedBy?: User | string;
}

@View({
  name: 'owned',
  parent: 'editable',
  live: true,
  acl: 'ownerAny',
  aclByRecord: true,
  ownerField: 'owner'
})
export class Owned extends Editable {
  @Field({ type: 'LookupField', relatedView: 'users', editable: false, creatable: false })
  owner?: User | string;
}
