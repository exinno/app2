import { fieldsSelectField, PropOptions, WebActionModel } from '..';
import { Field, View } from '../model.decorator';
import { DataViewModel, DataViewService } from './data.view';

export const formModes = ['edit', 'add', 'view'] as const;
export type FormMode = typeof formModes[number];

/** Form view model */
@View({
  name: 'formView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Form Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class FormViewModel extends DataViewModel {
  declare type: 'FormView';

  name? = 'FormView';

  /** Form fields define list of fields to be shown in the form view.
   *  Fields shows in the form by order listed in 'formFields'. */
  @Field({ type: 'PropField', propType: '(options: PropOptions<any>) => string[]', inputField: fieldsSelectField })
  formFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  @Field({ type: 'PropField', propType: '(options: PropOptions<any>) => string[]', inputField: fieldsSelectField })
  simpleFormFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  /** It defines mode of the form. Either 'edit', 'add' or 'view'. */
  @Field({ type: 'SelectField', optionItems: formModes })
  formMode?: FormMode;

  @Field()
  defaultCols?: number;

  @Field()
  submitAction?: string;

  viewActions? = ['submitForm', 'openRemove', 'refresh'];

  webActions?: WebActionModel<DataViewService>[] = [
    {
      name: 'submitForm',
      label: 'OK',
      icon: 'mdi-check',
      actionType: 'single',
      execute: ({ viewService }) => {
        (viewService as any).submit();
      }
    },
    {
      name: 'toggleForm',
      label: ({ viewModel }) => (viewModel.componentProps?.fieldsType != 'simpleFormFields' ? 'Detailed' : 'Simple'),
      icon: 'mdi-list-box-outline',
      actionType: 'overall',
      execute: async ({ viewModel }) => {
        viewModel.componentProps ??= {};
        viewModel.componentProps.fieldsType =
          viewModel.componentProps.fieldsType == 'simpleFormFields' ? 'formFields' : 'simpleFormFields';
      },
      selected: ({ viewModel }) => viewModel.componentProps?.fieldsType != 'simpleFormFields'
    }
  ];
}

export function isFormView(model: any): model is FormViewModel {
  return model.type == 'FormView';
}
