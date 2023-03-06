import { FormViewModel } from '../../../model';

export const fieldEditor: FormViewModel = {
  type: 'FormView',
  parent: 'fields',
  noServer: true,
  viewActions: ['toggleForm', 'submitForm'],
  defaultCols: 12,
  componentProps: { fieldsType: 'simpleFormFields' },
  watches: [
    {
      watch: ({ data }) => data,
      execute({ data, viewModel, registry: { modelService, common, _ } }) {
        // field.type이 변경된 경우 simpleFormFields 변경이 반영되어야 함
        if (!data?.type) return;
        const formView = viewModel as FormViewModel;
        const parent = _.lowerFirst(data?.type ?? 'fields');
        if (formView.parent === parent) return;
        formView.parent = modelService.findByName(parent, 'views') ? parent : 'fields';
        delete formView.fields;
        delete formView.fieldGroups;
        delete formView.simpleFormFields;
        common.replaceObject(formView, modelService.extend(formView, 'views', true));
      },
      deep: true
    }
  ]
};
