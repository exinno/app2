import { AnyFieldModel, Field, FieldModel, PropOptions, View } from '..';

/** Prop field */
@View({
  name: 'propField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'propType']
})
export class PropFieldModel extends FieldModel {
  declare type: 'PropField';

  name? = 'PropField';

  icon? = 'mdi-script-text-play';

  dataType? = 'string' as const;

  columnType? = 'string' as const;

  @Field()
  hideScriptField?: boolean;

  @Field()
  inputField?: AnyFieldModel | ((options: PropOptions<PropFieldModel>) => AnyFieldModel);

  @Field()
  propType: string;
}
