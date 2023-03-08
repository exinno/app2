import { MenuItem, View, Field } from '../..';

@View({
  name: 'bookmarks',
  table: 'OcBookmark',
  parent: 'owned',
  labelField: 'label',
  columnFields: ['label', 'path'],
  formFields: ['label', 'icon', 'path']
})
export class Bookmark implements MenuItem {
  @Field({ type: 'StringField', cols: 8, required: true })
  label: string;

  @Field({ type: 'IconField', cols: 4 })
  icon?: string;

  @Field({ type: 'StringField', cols: 12, required: true })
  path: string;

  @Field({ name: 'parent', type: 'LookupField', relatedView: 'bookmarks' })
  parent?: Bookmark;

  @Field({ type: 'CheckboxField', defaultValue: false })
  isFolder?: boolean;
}
