import { Field, View, dictPropField, PropOptions } from '..';
import { Dict } from '../..';
import { DataViewModel } from './data.view';

/** List view model */
@View({
  name: 'listView',
  parent: 'dataViews',
  extraFieldGroup: {
    label: 'List options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class ListViewModel extends DataViewModel {
  declare type?: 'ListView' | 'CommentView' | 'AttachmentView';

  name? = 'ListView';

  @Field({
    type: 'PropField',
    propType:
      'ListSectionModel[] | ListSectionModel[][] | ((options: PropOptions<any>) => ListSectionModel[] | ListSectionModel[][])'
  })
  listSections?:
    | ListSectionModel[]
    | ListSectionModel[][]
    | (<T extends this>(options: PropOptions<T>) => ListSectionModel[] | ListSectionModel[][]);

  @Field({ type: 'CheckboxField' })
  separator?: boolean = true;

  @Field({ type: 'CheckboxField' })
  bordered?: boolean;

  @Field({ type: 'CheckboxField' })
  padding?: boolean;

  @Field({ type: 'CheckboxField' })
  dense?: boolean;

  @Field({ type: 'CheckboxField' })
  allowMultipleSelection?: boolean;

  /** Number of records loaded in one page. */
  @Field({ type: 'NumberField' })
  pageSize?: number = 25;

  @Field()
  allowSelection?: boolean;

  @Field()
  selectedClass?: string;

  @Field()
  clickable?: boolean = true;

  @Field()
  infiniteScrollReverse?: boolean = false;

  @Field()
  infiniteScrollStyle?: string;

  @Field()
  infiniteScrollOffSet?: number = 100;

  @Field()
  hideLoadingSpinner?: boolean;
}

export class ListSectionModel extends DataViewModel {
  @Field()
  name?: string;

  @Field({ type: 'CheckboxField' })
  avatar?: boolean;

  @Field({ type: 'CheckboxField' })
  thumbnail?: boolean;

  @Field({ type: 'CheckboxField' })
  side?: boolean;

  @Field({ type: 'CheckboxField' })
  top?: boolean;

  @Field({ type: 'CheckboxField' })
  noWrap?: boolean;

  @Field(dictPropField)
  sectionClass?: string | Dict;

  @Field()
  sectionStyle?: string;

  @Field({
    type: 'PropField',
    propType: 'string[]'
  })
  listFields?: string[];
}

export function isListView(model: any): model is ListViewModel {
  return !!model.listSections;
}
