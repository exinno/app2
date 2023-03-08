import { PropFieldModel, SelectFieldModel } from '.';

export const fieldSelectField: SelectFieldModel = {
  type: 'SelectField',
  labelField: 'name',
  keyField: 'name',
  optionItems: ({ data }) => data.fields
};

export const fieldsSelectField: SelectFieldModel = {
  ...fieldSelectField,
  multiple: true
};

/*
export const fieldsSelectField: PropFieldModel = {
  type: 'PropField',
  inputField: { ...fieldSelectField, multiple: true },
  propType: 'string[] | ((options: PropOptions<FieldModel>) => string[])'
};
*/

export const webActionSelectField: SelectFieldModel = {
  type: 'SelectField',
  optionItems: ({ registry: { modelService }, viewModel }) => modelService.getAvailableWebActions(viewModel)
};

export const webActionsSelectField: SelectFieldModel = {
  ...webActionSelectField,
  multiple: true
};

export const voidPropField: PropFieldModel = {
  type: 'PropField',
  propType: '(options: PropOptions<any>) => void'
};

export const asyncPropField: PropFieldModel = {
  type: 'PropField',
  propType: '(options: PropOptions<any>) => Promise<void>'
};

export const dictPropField: PropFieldModel = {
  type: 'PropField',
  propType: 'Dict | ((options: PropOptions<any>) => Dict)'
};

export const dictsPropField: PropFieldModel = {
  type: 'PropField',
  propType: 'Dict[] | ((options: PropOptions<any>) => Dict[])'
};

export const stringPropField: PropFieldModel = {
  type: 'PropField',
  inputField: {
    type: 'StringField'
  },
  propType: 'string | ((options: PropOptions<any>) => string)'
};
