import { Dict, FormViewModel, MessagingChannel } from 'index';

export const signUp: FormViewModel = {
  type: 'FormView',
  serverView: 'users',
  viewActionsOn: ['bottom'],
  viewActions: ['signUp'],
  submitAction: 'signUp',
  acl: 'public',
  stackLabel: false,
  defaultData({ registry: { common } }) {
    return common.getQueryObject();
  },
  serverActions: [
    {
      name: 'createDefaultSpace',
      execute: async ({ registry: { dataService, authService }, data }) => {
        if (!data.id && !data.principals) return;
        const space = {
          name: authService.user.displayName,
          owner: authService.user.id,
          spaceType: 'personal',
          storage: 'default'
        };
        await dataService.create({ view: 'spaces', data: space });
      }
    }
  ],
  webActions: [
    {
      name: 'signUp',
      icon: 'mdi-account-plus',
      actionType: 'overall',
      async execute({ viewService, registry: { authService, uiService, config, dataService }, data }) {
        if (!(await viewService.validate())) return;
        const user = await authService.signUp(data);
        /*
        계정 생성 시 개인 스페이스는 계정 형태에 따라 생성 되거나 사용 할 수 없는 경우가 있으므로 일단은 생성 하지 않음
        try {  
          await dataService.executeAction({ view: 'signUp', action: 'createDefaultSpace', data: user });
        } catch (error: any) {
          await dataService.remove({ view: viewService.serverView, dataId: user.id });
          throw new OccamError(error);
        }
        */
        config.approvalRequired
          ? uiService.notify({
              message:
                'Your account has been successfully created, but it needs to be approved by an admin prior to use'
            })
          : uiService.notify({
              message:
                !config.emailVerificationRequired || data.invitationToken
                  ? `You have successfully been signed up.`
                  : `Please check ${user.email} to verify the account`
            });
      }
    },
    {
      name: 'sendVerificationCode',
      icon: 'mdi-check-circle-outline',
      actionType: 'overall',
      hidden({ registry: { modelService } }) {
        if (!modelService.config.smsVerificationRequired) return true;
      },
      async execute({ registry: { authService, uiService, config }, data }) {
        const channel = config.messagingChannel;
        const messagingFormat = { sms: 'phoneNumber', email: 'email', kakao: 'kakao' };
        const contact = data[messagingFormat[channel]];
        const to: Dict<MessagingChannel> = { [channel]: contact };

        data.codeSent = true;
        await authService.sendVerificationCode(to[channel], channel);
        uiService.notify({
          message: `Verification code has been sent to ${contact}.`
        });
      }
    },
    {
      name: 'checkVerificationCode',
      icon: 'mdi-check-decagram',
      actionType: 'overall',
      async execute({ registry: { authService, uiService }, data }) {
        const verificationCode = await authService.getVerificationCode();
        if (data.verificationCode === verificationCode) data.verificationCodeValidated = true;

        uiService.notify(
          data.verificationCodeValidated
            ? { message: 'Has been verified', type: 'positive' }
            : { message: 'Verification failed', type: 'negative' }
        );
      }
    }
  ],
  fields: [
    {
      type: 'StringField',
      name: 'email',
      label: 'Email',
      inputType: 'email',
      validators: ['email'],
      required: true,
      cols: 12,
      validate: async ({ value, registry: { authService } }) => {
        if (!value) return true;
        const checkUser = await authService.isExistingUser(value, 'email');
        return !checkUser || `There is an account already signed up by email ${value}.`;
      },
      editable: ({ data }) => {
        return !data.withGoogle;
      }
    },
    {
      type: 'StringField',
      name: 'phoneNumber',
      label: 'Phone Number',
      inputType: 'number',
      validators: ['phoneNumber'],
      cols: 8,
      actions: ['sendVerificationCode'],
      validate: async ({ value, registry: { authService } }) => {
        if (!value) return true;
        const checkUser = await authService.isExistingUser(value, 'phoneNumber');
        return !checkUser || `There is an account already signed up by phone number ${value}.`;
      }
    },
    {
      type: 'StringField',
      name: 'verificationCode',
      label: 'Verification Code',
      cols: 4,
      actions: ['checkVerificationCode'],
      validate: ({ value }) => {
        if (value.length <= 0) return 'Please write code.';
      },
      hidden: ({ data }) => {
        return !data.codeSent || data.withGoogle;
      }
    },
    {
      type: 'StringField',
      name: 'name',
      label: 'Username',
      hidden: true,
      autocomplete: 'username',
      cols: 12,
      validate: async ({ value, registry: { authService } }) => {
        if (!value || value.length < 6) return 'Username must be 6 or more characters.';
        return !(await authService.isExistingUser(value, 'username')) || `Username ${value} already exists.`;
      }
    },
    {
      type: 'StringField',
      name: 'password',
      inputType: 'password',
      autocomplete: 'new-password',
      required: true,
      cols: 12,
      validators: ['password'],
      hidden: ({ data }) => {
        return data.withGoogle;
      }
    },
    {
      type: 'StringField',
      name: 'confirmPassword',
      inputType: 'password',
      autocomplete: 'new-password',
      required: true,
      temporary: true,
      cols: 12,
      validate: ({ value, data }) => {
        if (!(data.password === value)) return 'Password does not match';
      },
      hidden: ({ data }) => {
        return data.withGoogle;
      }
    },
    {
      type: 'StringField',
      name: 'displayName',
      label: 'Full name',
      required: true,
      cols: 12
    },
    {
      type: 'StringField',
      name: 'picture',
      label: 'Picture',
      cols: 12,
      hidden: true
    },
    {
      type: 'CheckboxField',
      name: 'agreement',
      label: 'I agree to the terms and conditions.',
      required: true,
      cols: 12,
      defaultValue: false,
      validate: ({ value }) => {
        return value || `Please agree on conditions.`;
      }
    }
  ]
};
