import { Field, FieldModel, View } from '..';

/** Script field */
@View({
  name: 'scriptField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'language', 'defaultValue']
})
export class ScriptFieldModel extends FieldModel {
  declare type: 'ScriptField';

  name? = 'ScriptField';

  icon? = 'mdi-script-text';

  dataType? = 'string' as const;

  columnType? = 'text' as const;

  /** Type of language will be using in the script.
   *  Default to 'typescript'. */
  @Field({ type: 'StringField' })
  language?: string = 'typescript';

  cols? = 12;
}
