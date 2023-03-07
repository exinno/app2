import { FormViewModel } from 'index';

export const timeZones = ['Korea/Seoul', 'Japan/Tokyo'] as const;

export const profile: FormViewModel = {
  type: 'FormView',
  parent: 'users',
  dataId: ({ registry: { authService } }) => authService.user.id,
  viewActions: ['submitForm', 'changePassword', 'openActivities', 'deleteAccount'],
  webActions: [
    {
      name: 'activities',
      icon: 'mdi-history',
      label: 'activities',
      execute: async ({ registry: { uiService }, viewService, data }) => {
        await uiService.openModal({
          view: {
            parent: 'activities',
            width: '1000px',
            refreshOnFilterChange: true,
            filter: { user: data.name }
          },
          parentView: viewService
        });
      }
    },
    {
      name: 'deleteAccount',
      label: 'Delete Account',
      icon: 'mdi-trash-can',
      actionType: 'overall',
      async execute({ registry: { authService, dataService, uiService } }) {
        const confirm = await uiService.confirm({
          message: 'Do you really want to delete your account?',
          icon: 'mdi-alert-circle-outline'
        });
        if (confirm) {
          await uiService.close(uiService.lastOpened);
          await dataService.remove({
            skipAcl: true,
            view: 'users',
            filter: { field: 'name', value: authService.user.name }
          });
          await authService.signOut();
          uiService.notify({ message: 'Account has been deleted' });
        }
      }
    }
  ],
  formFields: ['picture', 'name', 'timeZone', 'displayName', 'email', 'phoneNumber', 'locale'],
  fields: [
    {
      name: 'name',
      type: 'LabelField'
    },
    {
      name: 'email',
      type: 'LabelField'
    },
    {
      name: 'picture',
      type: 'ImageEditorField',
      label: 'Profile Picture',
      cols: 12,
      height: '100px',
      width: '100px',
      crop: 'Circle',
      emptyImage: '/static/user.png',
      onChange({ registry: { authService }, data }) {
        const { picture, name } = data;
        void authService.updateUser({ picture, name });
      }
    },
    {
      name: 'timeZone',
      label: 'Time Zone',
      type: 'SelectField',
      optionItems: timeZones
    },
    { name: 'phoneNumber', label: 'Phone Number', type: 'LabelField', editable: false },
    { name: 'locale', label: 'Language', type: 'LabelField', editable: false }
  ]
};
