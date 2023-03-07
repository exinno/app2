import { asArray, Permission, permissions, FormViewModel, Model } from '..';
import { Field, View } from '../model/model.decorator';

@View({
  name: 'acls',
  label: 'Permissions',
  icon: 'mdi-shield-key',
  type: 'DataGridView',
  table: 'OcAcl',
  keyField: 'name',
  labelField: 'name',
  updatedAtField: 'updatedAt',
  updatedByField: 'updatedBy',
  createdByField: 'owner',
  ownerField: 'owner',
  aclByRecord: true,
  orderBy: [{ field: 'updatedAt', direction: 'desc' }],
  columnFields: ['name', 'objectType', 'objectId', 'parentAcl', 'owner', 'updatedAt', 'updatedBy', 'description'],
  detailView: {
    type: 'FormView',
    formFields: [
      'name',
      'objectType',
      'objectId',
      'parentAcl',
      'owner',
      'updatedAt',
      'updatedBy',
      'description',
      'aces'
    ],
    viewActions: ['shareLink', 'submitForm']
  },
  optimisticLock: true,
  indexes: [{ name: 'IX_ACL_01', fields: ['objectType', 'objectId'], indexType: 'UNIQUE' }],
  async afterSave({ registry: { aclService, common }, data }) {
    for (const acl of asArray<Acl>(data)) {
      aclService.clearAcl(acl.name);
    }
  }
})
export class Acl {
  /** Unique name of the acl. Name defines access permission to models.
   *  Names can have 2 forms.
   *  predefined = Predefined form of name such as 'private', 'authenticated' and etc. (when 'objectType' is null or any)
   *  combined = Combined form ('objectType' + '$' + 'objectId') of name such as 'view$test'.
   *  Defined in 'ACLs' screen (Need permission to access).
   *  TODO check.*/
  @Field({
    type: 'StringField',
    required: true,
    updatable: false,
    hidden: ({ data }) => data && !!data.objectType,
    valueFormatter({ data, value }) {
      return data.objectType ? '' : value;
    }
  })
  name: string;

  /** Refers to name of the model (views, menus, actions, etc.). */
  @Field({
    type: 'SelectField',
    label: 'View',
    keyField: 'name',
    labelField: 'label',
    updatable: false,
    optionItems: ({ registry: { modelService } }) => modelService.getViewsForSelect()
  })
  objectType: string;

  /** Refers to 'name' of the view or 'dataId' of the view .*/
  @Field({
    type: 'StringField',
    label: 'Data ID',
    updatable: false
  })
  objectId: string;

  /** Parent acl gets automatically filled (based on acl of the model) when view is selected upon creating new acl.
   *  It uses default acl from config if model's acl is not defined. 
    //TODO check */
  @Field({
    type: 'LookupField',
    relatedView: 'acls',
    label: 'Security level',
    actions: ['openLookupEdit'],
    computed: ({ registry: { modelService, common, _ }, data }) => {
      if (!data.objectType) return undefined;

      const defaultAcl = modelService.config.defaultAcl;
      let model: Model;
      if (common.isModelType(data.objectType)) {
        model = modelService.getFromFlatten(data.objectId, data.objectType);
      } else {
        model = modelService.get(data.objectType, 'views', null, true);
      }
      return model?.acl ?? defaultAcl;
    }
  })
  parentAcl: string;

  /** Owner who created new acl. */
  @Field({ type: 'LookupField', relatedView: 'principals', creatable: false })
  owner?: any;

  /** 'updatedAt' identifies when was the record updated. */
  @Field({ type: 'DateField', dateType: 'dateTime', editable: false, creatable: false })
  updatedAt?: Date;

  /** 'updatedBy' identifies who updated the record.*/
  @Field({ type: 'LookupField', relatedView: 'users', editable: false, creatable: false })
  updatedBy?: any;

  /** Description of the acl. */
  @Field({ type: 'StringField', cols: 12 })
  description: string;

  /** Ace is set of actions (get, find, save and etc.) available in each acl.
   *  Single acl can have multiple aces.
   *  Aces can be defined in 'aces' screen. (simply add principal with permissions).
   * TODO check */
  @Field({
    label: 'Permissions',
    type: 'DataGridField',
    relatedView: 'aces',
    relatedField: 'acl',
    cols: 12,
    dataGridModel: {
      columnFields: ['principal', 'priority', 'permissions'],
      detailView: {
        type: 'FormView',
        formFields: ['principal', 'priority', 'permissions']
      }
    }
  })
  aces: Ace[];
}

@View({
  name: 'aces',
  type: 'DataGridView',
  table: 'OcAce',
  keyField: 'id',
  labelField: 'principal',
  label: 'Permission item',
  keyGenerator: 'random',
  updatedAtField: 'updatedAt',
  orderBy: [
    { field: 'priority', direction: 'desc' },
    { field: 'updatedAt', direction: 'desc' }
  ],
  async afterSave({ registry: { aclService }, data }) {
    for (const ace of asArray<Ace>(data)) {
      aclService.clearAcl(ace.acl);
    }
  }
})
export class Ace {
  /** Unique id of the ace*/
  @Field({ type: 'StringField', hidden: true })
  id: string;

  /** Acl in ace refers to ace available in corresponding acl. */
  @Field({ type: 'LookupField', relatedView: 'acls', hidden: true })
  acl?: string;

  /** Principal in ace refers to ace available in corresponding principal.
   * Every principal have their own 'ace'. */
  @Field({ type: 'LookupField', label: 'User or Group', relatedView: 'principals', required: true })
  principal: any;

  /**  Default to 1
   * TODO working
   */
  @Field({ type: 'NumberField', scale: 0, required: true, defaultValue: 1, hidden: true })
  priority?: number;

  /** Updated at identifies when was the record updated. */
  @Field({ label: 'Updated At', type: 'DateField', dateType: 'dateTime', editable: false, creatable: false })
  updatedAt?: Date;

  /** Permissions are list of events available such as 'find', 'save', 'create', 'executeAction' and etc.
   *  Permissions are differ by acls and principals.
   *  Range of permissions can be as large as view and as small as data record. */
  @Field({
    label: 'Permissions',
    type: 'SelectField',
    dataType: 'array',
    multiple: true,
    optionItems: permissions,
    cols: 12,
    width: 300
  })
  permissions?: Permission[];
}

export const permission: FormViewModel = {
  type: 'FormView',
  parent: 'acls',
  label: ({ pageCtx }) => pageCtx?.objectLabel + ' Permission',
  includeSelect: ['objectType'],
  formFields: ['parentAcl', 'aces'],
  viewActions: ['submitForm']
};
