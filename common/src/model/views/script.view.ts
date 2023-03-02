import { Field, View, WebActionModel, ViewModel, ViewService } from '..';

const lineNumbers = <const>['on', 'off', 'relative', 'interval'];

/** Script view model */
@View({
  name: 'scriptView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Script Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class ScriptViewModel extends ViewModel {
  declare type?: 'ScriptView';

  name? = 'ScriptView';

  /** Type of language will be using in the script.
   *  Default to 'typescript'. */
  @Field({ type: 'StringField' })
  language?: string = 'typescript';

  /** Whether serialization (process of translating a data structure or object state into a format that can be stored) is needed or not. */
  @Field({ type: 'CheckboxField' })
  serializeNeeded?: boolean;

  /** It adds Prefix to the value. */
  @Field({ type: 'StringField' })
  sourcePrefix?: string;

  /** It adds an additional source file to the language service. */
  @Field({ type: 'StringField' })
  extraLib?: string;

  /** Whether to allow auto-save or not.
   *  If its true codes are automatically saved as user write in script view. */
  @Field({ type: 'CheckboxField' })
  autoSave?: boolean;

  /** Whether to apply predefined prettier (code formatter) options or not. */
  @Field({ type: 'CheckboxField' })
  formatting?: boolean;

  /** It controls the rendering of line numbers. Such as 'on', 'off', 'relative' and 'interval'.
   *  Defaults to 'on'. */
  @Field({
    type: 'SelectField',
    optionItems: lineNumbers,
    multiple: false
  })
  lineNumbers?: typeof lineNumbers[number];

  /** */
  @Field({ type: 'CheckboxField' })
  updateDirectly?: boolean;

  /** It ignores the value starts with given character. */
  @Field({ type: 'StringField' })
  ignoreStartsWith?: string;

  viewActions? = ['saveScript'];

  webActions?: WebActionModel<ScriptViewService, this>[] = [
    {
      name: 'saveScript',
      label: 'Save',
      icon: 'mdi-check',
      execute: ({ viewService }) => {
        viewService.submit();
      },
      disabled: ({ viewService }) => {
        return !viewService.validate?.();
      }
    }
  ];
}

export interface ScriptViewService extends ViewService {
  validate?(): Promise<boolean | undefined>;
  submit?(): void;
}
