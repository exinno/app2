// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// reflect-metadata가 ej2-vue와 충돌을 일으켜서 common에서는 dependency를 제거함
import _ from 'lodash';
import { AnyFieldModel, AnyViewModel } from '.';

export function View(options: AnyViewModel): ClassDecorator {
  return (target) => {
    if (!Reflect.getOwnMetadata) return;
    const viewModel = Reflect.getOwnMetadata('model', target.prototype) ?? {};
    Object.assign(viewModel, options);
    viewModel.$modelType = 'views';
    Reflect.defineMetadata('model', viewModel, target.prototype);
  };
}

export function Field(options?: AnyFieldModel): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    if (!Reflect.getOwnMetadata) return;
    let viewModel: ViewModel = Reflect.getOwnMetadata('model', target);

    if (!viewModel) {
      viewModel = { fields: [] };
      Reflect.defineMetadata('model', viewModel, target);
    }
    const fieldModel = { name: propertyKey, ...options };
    fieldModel.$modelType = 'fields';
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    if (type && !fieldModel.type) fieldModel.type = FIELD_MODEL_MAP[type.name];

    const existFieldIndex = viewModel.fields.findIndex((field) => field.name === propertyKey);
    if (existFieldIndex != -1) {
      // 부모 필드가 있으면 대체
      viewModel.fields[existFieldIndex] = fieldModel;
    } else {
      viewModel.fields.push(fieldModel);
    }
  };
}

const FIELD_MODEL_MAP = {
  String: 'StringField',
  Boolean: 'CheckboxField',
  Number: 'NumberField'
  // TODO: 추가 필요
};
