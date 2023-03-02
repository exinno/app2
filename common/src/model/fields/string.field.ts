import { Field, FieldModel, View } from '..';

export type InputType = typeof InputTypes[number];

const InputTypes = <const>[
  'text',
  'password',
  'textarea',
  'email',
  'search',
  'tel',
  'file',
  'number',
  'url',
  'time',
  'date'
];

/** String field */
@View({
  name: 'stringField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'inputType', 'defaultValue']
})
export class StringFieldModel extends FieldModel {
  declare type: 'StringField';

  name? = 'StringField';

  icon? = 'mdi-form-textbox';

  dataType? = 'string' as const;

  columnType? = 'string' as const;

  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete */

  /** 'autocomplete' specifies what if any permission the user agent has to provide automated assistance in filling out form field values,
   *  as well as guidance to the browser as to the type of information expected in the field. */
  @Field({ type: 'StringField' })
  autocomplete?: string;

  /** 'columnLength' can be set when creating column in database and type is 'string'.
   *  Length defaulting to 255. */
  @Field({ type: 'NumberField' })
  columnLength?: number;

  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types */

  /** Works varies considerably depending on the value of its type attribute.
   *  Such as 'text', 'password', 'email', 'number' and etc.
   *  Default to 'text'. */
  @Field({
    type: 'SelectField',
    optionItems: InputTypes,
    multiple: false
  })
  inputType?: InputType = 'text';

  @Field()
  placeholder?: string;

  @Field()
  outlined?: boolean;

  @Field()
  rounded?: boolean;

  @Field()
  dense?: boolean;

  @Field()
  filled?: boolean;
}

export const isStringField = (field: any): field is StringFieldModel => field.type == 'StringField';
