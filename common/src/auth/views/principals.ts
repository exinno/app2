import { asArray } from 'index';
import { Editable } from 'index';
import { ListViewModel, TabViewModel } from 'index';
import { Field, View } from 'index';

@View({
  name: 'principals',
  type: 'DataGridView',
  table: 'OcPrincipal',
  parent: 'editable',
  acl: 'authRead',
  aclByRecord: true,
  labelField: 'displayName',
  ownerField: 'id',
  orderBy: [{ field: 'updatedAt', direction: 'desc' }]
})
export class Principal extends Editable {
  /** Name of the user. Value of a name property should be unique since, It is used as login ID.  */
  @Field({ type: 'StringField', required: true, editable: false })
  name?: string;

  /** User can choose principal type between 'user' and 'group'.
   *  A user or a group of users to apply the rule for.
   *  TODO check */
  @Field({ type: 'ChoiceField', choice: 'principalType', required: true, hidden: true })
  principalType?: 'user' | 'group';

  /** Name showed in app. */
  @Field({ type: 'StringField', required: true, label: 'Full Name' })
  displayName?: string;

  /** Picture used as user profile. */
  @Field({ type: 'ImageField' })
  picture?: string;

  /** Description of the user. */
  @Field({ type: 'StringField', cols: 12 })
  description?: string;
}

@View({
  name: 'users',
  parent: 'principals',
  columnFields: [
    'name',
    'displayName',
    'email',
    'phoneNumber',
    'accountLocked',
    'loginTried',
    'expiredAt',
    'country',
    'city',
    'accountApproved',
    'accountSuspended'
  ],
  serverFilter: { field: 'principalType', value: 'user' },
  serverDefaultData: { principalType: 'user' }
})
export class User extends Principal {
  /** Password of the user. Password is encrypted using 'bcrypt' (one-way encryption). */
  @Field({ type: 'StringField', encryption: 'bcrypt' })
  password?: string;

  /** Email address of the user. */
  @Field({ type: 'StringField', validators: ['email'], editable: false })
  email?: string;

  /** Phone number of the user. */
  @Field({ type: 'StringField', validators: ['phoneNumber'] })
  phoneNumber?: string;

  /** Whether account of the user is locked or not.
   *  Account is locked when user failed to login more than regulation defined.
   *  Need to contact admin to unlock the account. */
  @Field({ type: 'CheckboxField', defaultValue: false })
  accountLocked?: boolean;

  /** Whether account of the user is approved by admin or not.
   *  If approval requirement is set to true, then admin must approve user to use the account. */
  @Field({ type: 'CheckboxField', defaultValue: false })
  accountApproved?: boolean = false;

  /** Whether account is suspended or not. Suspension could be due to security or other reasons. */
  @Field({ type: 'CheckboxField', defaultValue: false })
  accountSuspended?: boolean = false;

  /** Number of time user has tried to login, and failed.
   *  It increases by 1 evert time users fail to login. */
  @Field({ type: 'NumberField', defaultValue: 0 })
  loginTried?: number;

  /** Users possess different types of principals.
   *  Every principals have their own 'ace'(access control entry). */
  principals?: string[] = [];

  /** Date of password gets expired. Need to update password if got expired. */
  @Field({ type: 'DateField', dateType: 'dateTime', editable: false, creatable: false })
  expiredAt?: Date;

  /** Browser timezone user will be using. */
  @Field({ type: 'StringField' })
  timeZone?: string;

  /** Browser language user will be using. */
  @Field({ type: 'StringField' })
  locale?: string;

  /** Whether account has been verified through email or phone number.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  accountVerified?: boolean = false;

  /** Whether user used OAuth to login but have not registered in the app yet.
   *  If its true, will be redirected to the sign up page. */
  notSignedIn?: boolean;

  withGoogle?: boolean;

  verificationCodeValidated?: boolean;

  invitationToken?: string;

  /** Token used for verifying and resetting user account by link. */
  @Field()
  token?: string;

  /** Time user token created. */
  @Field()
  tokenCreatedAt?: number;

  @Field()
  lastSignedIn?: Date;

  /** City of the user logged in. */
  @Field({ type: 'StringField', editable: false })
  city?: string;

  /** Country of the user logged in. */
  @Field({ type: 'StringField', editable: false })
  country?: string;

  /** IP of the user logged in. */
  @Field({ type: 'StringField', editable: false })
  ip?: string;

  @Field({
    type: 'ChoiceField',
    choice: 'userStatus',
    listFieldHideLabel: true,
    cellStyle: 'font-size: 24px;'
  })
  status?: string;
}

@View({
  name: 'groups',
  parent: 'principals',
  ownerField: 'owner',
  serverFilter: { field: 'principalType', value: 'group' },
  serverDefaultData: { principalType: 'group', groupType: 'group' },
  columnFields: ['name', 'displayName', 'description', 'updatedAt', 'updatedBy'],
  detailView: 'groupDetail',
  beforeCreate: async ({ data }) => {
    for (const group of asArray(data)) {
      if (group.name) group.id ??= group.name;
    }
  },
  beforeRemove: async ({ dataId, registry: { dataService } }) => {
    await dataService.remove({ view: 'groupMembers', filter: { group: dataId }, skipNoRecord: true, skipAcl: true });
  }
})
export class Group extends Principal {
  @Field({ type: 'ChoiceField', choice: 'groupType', required: true })
  groupType: string;

  @Field({ type: 'LookupField', relatedView: 'principals', required: true })
  owner?: any;
}

export const groupDetail: TabViewModel = {
  type: 'TabView',
  hideToolbar: true,
  bottomTabs: true,
  defaultTab: 0,
  children: [
    {
      label: 'Group',
      type: 'FormView',
      parent: 'groups',
      viewActions: ['submitForm']
    },
    {
      label: 'Members',
      type: 'DataGridView',
      parent: 'groupMembers',
      refreshOnFilterChange: true,
      // TODO: EjDataGridView의 dataId가 reactive하지 않아서 임시조치. get dataId를 this.props.dataId로 하면 get columns가 변경되어 refresh발생
      defaultData: ({ viewService }) => ({ group: viewService.parentView.dataId }),
      filter: ({ viewService }) => ({ group: viewService.parentView.dataId })
    }
  ]
};

@View({
  name: 'groupMembers',
  type: 'DataGridView',
  table: 'OcGroupMember',
  parent: 'editable',
  acl: 'groupReadOnly',
  aclByRecord: true,
  ownerField: 'group.owner',
  groupField: 'group',
  keyField: 'id',
  labelField: 'member',
  keyGenerator: 'random',
  label: 'Group members',
  updatedAtField: 'updatedAt',
  updatedByField: 'updatedBy',
  orderBy: [{ field: 'updatedAt', direction: 'desc' }],
  mobileView: 'groupMemberList',
  detailView: {
    type: 'FormView',
    formFields: ['member', 'role'],
    viewActions: ['submitForm', 'openRemove'],
    width: '600px'
  },
  indexes: [{ name: 'UX_OcGroupMember', indexType: 'UNIQUE', fields: ['group', 'member'] }],
  beforeRemove: async ({ dataId, filter, registry: { notificationService, dataService } }) => {
    if (!dataId) {
      const members = await dataService.getAll({ view: 'groupMembers', filter, select: 'id' });
      dataId = members.map((member) => member.id);
    }
    for (const id of asArray(dataId)) {
      const groupMember = await dataService.get<GroupMember>({
        view: 'groupMembers',
        dataId: id,
        select: ['group', 'member']
      });

      if (groupMember.member)
        await notificationService.notify({
          to: groupMember.member.id,
          type: 'memberChanged',
          message: { type: 'remove', group: groupMember.group }
        });
    }
  },
  afterCreate: async ({ data, registry: { notificationService } }) => {
    for (const groupMember of asArray(data)) {
      await notificationService.notify({
        to: groupMember.member,
        type: 'memberChanged',
        message: { type: 'create', group: groupMember.group }
      });
    }
  }
})
export class GroupMember extends Editable {
  /** Name of the group which user belongs to. */
  @Field({ type: 'LookupField', relatedView: 'groups', required: true, hidden: true })
  group: any;

  /** Member who belongs to the group. */
  @Field({ type: 'LookupField', relatedView: 'users', required: true })
  member: any;

  @Field({ type: 'ChoiceField', choice: 'memberRole', columnDefault: 'member', defaultValue: 'member', required: true })
  role?: string;

  @Field({ type: 'CheckboxField' })
  muted?: boolean;
}

export const groupMemberList: ListViewModel = {
  type: 'ListView',
  parent: 'groupMembers',
  itemClickAction: 'openEdit',
  listSections: [
    {
      side: true,
      avatar: true,
      listFields: ['member.picture']
    },
    {
      listFields: ['member.displayName']
    },
    {
      side: true,
      listFields: ['role', 'actions']
    }
  ],
  fields: [
    {
      name: 'actions',
      label: 'Actions',
      type: 'ActionField',
      actionSize: 'sm',
      laidCount: 1,
      actions: ['openRemove', 'openEdit']
    }
  ]
};
