import { ValidatorModel } from '../..';

const list: Array<ValidatorModel> = [
  {
    name: 'required',
    validate: ({ value, model, registry: { messageService } }) =>
      (value != null && value !== '') || `${messageService.getLabel(model)} is required`
  },
  {
    name: 'subdomain',
    validate: ({ value }) =>
      !value ||
      /^[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?$/.test(value) ||
      `This is not a valid subdomain. It can contain up to 64 characters, including lowercase letters, numbers, and dashes.`
  },
  {
    name: 'email',
    validate: ({ value }) =>
      !value || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || `This is not a valid email address.`
  },
  {
    name: 'password',
    validate: ({ value, registry: { modelService } }) => {
      const { passwordMaxLen, passwordMinLen } = modelService.model.auth;
      return (
        RegExp(`^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{${passwordMinLen},${passwordMaxLen}}$`).test(value) ||
        `Password should be ${passwordMinLen} ~ ${passwordMaxLen} letters with numbers and special characters`
      );
    }
  },
  {
    name: 'phoneNumber',
    validate: ({ value }) =>
      !value || /^\d{2,3}-?\d{4}-?\d{4}$/.test(value) || `Please enter valid phone number without hyphen(-) `
  },
  {
    name: 'url',
    validate: ({ value }) =>
      !value ||
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
        value
      ) ||
      'Please enter a valid URL'
  }
];

export default list;
