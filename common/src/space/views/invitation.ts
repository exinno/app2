import { FormViewModel, GroupMember } from 'index';

export const invitation: FormViewModel = {
  type: 'FormView',
  label: 'Send Invitation',
  viewActionsOn: ['bottom'],
  viewActions: ['sendInvitation'],
  viewActionsClass: 'column',
  width: '600px',
  acl: 'public',
  table: 'space_invitation',
  formFields: ['email'],
  keyField: 'email',
  webActions: [
    {
      name: 'sendInvitation',
      icon: 'mdi-email-outline',
      actionType: 'overall',
      async execute({ registry: { authService, dataService, uiService }, data: { email }, viewService }) {
        if (!(await viewService.validate())) return;

        const userSignedUp = await authService.isExistingUser(email, 'email');
        const pageCtx = viewService.parentView.pageCtx;

        if (userSignedUp) {
          const invitedUser = await authService.getUser(email, 'email');

          const belongingGroup = await dataService.find<GroupMember>({
            view: 'groupMembers',
            skipAcl: true,
            filter: {
              filters: [
                { field: 'group', value: pageCtx.spaceId },
                { field: 'member', value: invitedUser.id }
              ]
            }
          });

          if (belongingGroup.value.length) {
            return uiService.notify({
              message: `${email} is already a member of ${pageCtx.space.name}`
            });
          }
        }

        await authService.sendInvitation(email, authService.user.name, pageCtx);
        uiService.close(uiService.lastOpened);
        uiService.notify({ message: `Invitation has been sent to ${email}` });
      }
    }
  ],
  fields: [
    {
      type: 'StringField',
      name: 'email',
      inputType: 'email',
      validators: ['email'],
      required: true,
      cols: 12
    },
    { name: 'token', type: 'StringField' },
    { name: 'spaceId', type: 'StringField' }
  ]
};
