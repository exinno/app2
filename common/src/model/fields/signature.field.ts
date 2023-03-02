import { FieldModel, View } from '..';

/** Signature field */
@View({
  name: 'signatureField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label']
})
export class SignatureFieldModel extends FieldModel {
  declare type: 'SignatureField';

  name? = 'SignatureField';

  icon? = 'mdi-draw';

  dataType? = 'string' as const;

  columnType? = 'text' as const;

  cellStyle? = { 'text-align': 'center' };
}
