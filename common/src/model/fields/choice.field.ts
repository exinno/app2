import { ChoiceModel, Field, FieldModel, PropOptions, View } from '..';

/** Choice field */
@View({
  name: 'choiceField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'choice', 'multiple', 'defaultValue']
})
export class ChoiceFieldModel extends FieldModel {
  declare type: 'ChoiceField';

  name? = 'ChoiceField';

  icon? = 'mdi-form-dropdown';

  dataType? = 'string' as const;

  columnType? = 'string' as const;

  keyField?: string = 'value';

  labelField?: string = 'label';

  iconField? = 'icon';

  descriptionField? = 'description';

  /** Whether to allow choosing more than 1 item. */
  @Field({ type: 'CheckboxField' })
  multiple?: boolean;

  /** Field can be set from predefined choices
   *  Choice can be added in 'Choice' screen by clicking on add button.
   *  Also available to add items to choice by clicking on edit button. */
  @Field({
    type: 'SelectField',
    optionItems: ({ registry: { modelService } }) => modelService.getAll('choices')
  })
  choice: string;

  optionItems? = ({ model, registry: { modelService } }: PropOptions<this>) => {
    const choice: ChoiceModel = modelService.get(model.choice, 'choices');
    if (!choice) throw new Error(`Choice ${model.choice} not found`);
    return choice.choiceItems;
  };

  valueFormatter? = ({ value, model, registry: { modelService } }: PropOptions<this>) => {
    if (value == null) return value;
    const choice: ChoiceModel = modelService.get(model.choice, 'choices');
    const choiceItem = choice.choiceItems.find((item) => item.value == value);
    return choiceItem ? choiceItem.label : value;
  };
}
export const isChoiceField = (field: any): field is ChoiceFieldModel => field.type == 'ChoiceField';
