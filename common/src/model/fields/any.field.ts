import {
  ActionFieldModel,
  CheckboxFieldModel,
  CurrencyFieldModel,
  ChoiceFieldModel,
  DataGridFieldModel,
  DateFieldModel,
  IconFieldModel,
  ModalViewFieldModel,
  NumberFieldModel,
  PercentFieldModel,
  RichTextFieldModel,
  ScriptFieldModel,
  PropFieldModel,
  SelectFieldModel,
  StringFieldModel,
  TextFieldModel,
  JsonFieldModel,
  LookupFieldModel,
  CustomFieldModel,
  ColorFieldModel,
  SignatureFieldModel,
  MaskFieldModel,
  UppyAttachmentFieldModel,
  ImageFieldModel,
  ImageEditorFieldModel,
  LabelFieldModel,
  SheetFieldModel,
  BreadcrumbFieldModel,
  VideoFieldModel,
  ListFieldModel,
  ViewFieldModel,
  QrScannerFieldModel
} from '..';

export type AnyFieldModel =
  | ActionFieldModel
  | CheckboxFieldModel
  | CurrencyFieldModel
  | ChoiceFieldModel
  | DataGridFieldModel
  | DateFieldModel
  | IconFieldModel
  | ModalViewFieldModel
  | NumberFieldModel
  | PercentFieldModel
  | RichTextFieldModel
  | ScriptFieldModel
  | PropFieldModel
  | SelectFieldModel
  | StringFieldModel
  | TextFieldModel
  | JsonFieldModel
  | LookupFieldModel
  | ColorFieldModel
  | SignatureFieldModel
  | MaskFieldModel
  | UppyAttachmentFieldModel
  | ImageFieldModel
  | ImageEditorFieldModel
  | LabelFieldModel
  | SheetFieldModel
  | BreadcrumbFieldModel
  | VideoFieldModel
  | CustomFieldModel
  | ListFieldModel
  | ViewFieldModel
  | QrScannerFieldModel;

export type FieldType = AnyFieldModel['type'];
