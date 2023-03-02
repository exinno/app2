import { FieldModel, View } from '..';

@View({
  name: 'qrScannerField',
  parent: 'fields',
  simpleFormFields: ['type', 'name', 'label', 'defaultValue']
})
export class QrScannerFieldModel extends FieldModel {
  declare type?: 'QrScannerField';

  name? = 'QrScannerField';

  icon?: any = 'mdi-qrcode-scan';
}
