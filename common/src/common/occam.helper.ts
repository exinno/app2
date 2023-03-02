import _ from 'lodash';
import { isArray } from './type.checker';

export function simplifyDataToId(data: any, clone = false) {
  if (clone) data = _.cloneDeep(data);
  if (isArray(data)) {
    for (let i = 0; i < data.length; i++) data[i] = simplifyDataToId(data[i]);
  } else if (!clone && data?.$id !== undefined) {
    data = data.$id;
  } else if (data && Object.getPrototypeOf(data) === Object.prototype) {
    for (const field in data) data[field] = simplifyDataToId(data[field]);
  }

  return data;
}
