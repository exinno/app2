import { WebActionModel } from 'index';

export const openSignIn: WebActionModel = {
  label: 'Sign in',
  icon: 'mdi-login',
  execute: async ({ registry: { uiService } }) => {
    await uiService.openRoute({ view: '/signIn' });
  },
  hidden: ({ registry: { authService } }) => !!authService.user
};

export const signOut: WebActionModel = {
  icon: 'mdi-logout',
  ellipsis: true,
  execute: async ({ registry: { authService } }) => {
    await authService.signOut();
  },
  hidden: ({ registry: { authService } }) => !authService.user
};

export const openSignUp: WebActionModel = {
  label: 'Create an account',
  icon: 'mdi-account-plus',
  execute: async ({ registry: { uiService } }) => {
    await uiService.openRoute({ view: '/signUp' });
  },
  hidden: ({ registry: { authService } }) => !!authService.user
};

export const openProfile: WebActionModel = {
  label: 'Profile',
  icon: 'mdi-account-details-outline',
  ellipsis: true,
  execute: async ({ registry: { uiService } }) => {
    await uiService.openModal({ view: 'profile' });
  },
  hidden: ({ registry: { authService } }) => !authService.user
};

export const openForgotPassword: WebActionModel = {
  label: 'Forgot password',
  icon: 'mdi-magnify',
  execute: async ({ registry: { uiService } }) => {
    await uiService.openModal({ view: 'forgotPassword' });
  },
  hidden: ({ registry: { authService } }) => !!authService.user
};

export const googleSignIn: WebActionModel = {
  label: 'Continue with Google',
  icon: 'mdi-google',
  actionType: 'overall',
  execute: async ({ registry: { common } }) => {
    window.location.href = '/api/googleSignIn?redirect=' + common.getQueryObject().redirect;
  },
  hidden: ({ registry: { authService } }) => !!authService.user
};

export const changePassword: WebActionModel = {
  icon: 'mdi-lock-reset',
  execute: async ({ registry: { uiService }, viewService }) => {
    await uiService.openModal({ view: 'changePassword', parentView: viewService });
  },
  hidden: ({ registry: { authService } }) => !authService.user || authService.user.withGoogle
};

export const changeLanguage: WebActionModel = {
  icon: 'mdi-translate',
  ellipsis: true,
  label: ({ registry: { messageService } }) => {
    return messageService.getLanguageLabel(messageService.locale);
  },
  actionType: 'overall',
  execute: async ({ registry: { uiService, messageService }, viewService }) => {
    const result = await uiService.openModal({
      view: {
        type: 'FormView',
        label: 'Change Language',
        width: 600,
        fields: [
          {
            type: 'SelectField',
            name: 'language',
            optionItems: messageService.localeOptions,
            keyField: 'name',
            labelField: 'label',
            required: true,
            cols: 12
          }
        ],
        defaultData: { language: messageService.locale }
      },
      parentView: viewService
    });

    if (result?.language) {
      await messageService.changeLocale(result.language);
      uiService.updateApp();
    }
  }
};
