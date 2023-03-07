import { Dict } from 'index';
import { Field, PropOptions, View, voidPropField, stringPropField } from '..';
import { DataViewModel } from './data.view';

/** Nested list view model */
@View({
  name: 'nestedListView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Nested List options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class NestedListViewModel extends DataViewModel {
  declare type?: 'NestedListView';
  name? = 'NestedListView';

  /** It allows to drag between same group name. */
  @Field({ type: 'StringField' })
  dragGroup?: string;

  /** It shows list of children fields if exists. */
  @Field({ type: 'StringField' })
  childrenField?: string;

  /** Whether to only allow single root node or not. */
  @Field({ type: 'CheckboxField' })
  singleRootNode?: boolean;

  /** Whether to show delete button or not. */
  @Field({ type: 'CheckboxField' })
  showDelete?: boolean;

  /** Whether to show search input or not. */
  @Field({ type: 'CheckboxField' })
  showFilter?: boolean;

  /** */
  @Field(stringPropField)
  selectedKey?: string | (<T extends this>(options: PropOptions<T>) => string);

  /** Whether to expand icon only and not to the whole header. */
  @Field({ type: 'CheckboxField' })
  expandOnlyIcon?: boolean;

  @Field({ type: 'CheckboxField' })
  hideNoChildrenExpand?: boolean;

  /** Whether to items in list are visible or not. */
  @Field({
    type: 'PropField',
    propType: '(item: Dict) => boolean'
  })
  visible?: (item: Dict) => boolean;

  /** Whether putting expansion item into open state on initial render; Overridden by v-model if used. */
  @Field({
    type: 'PropField',
    propType: '(item: Dict) => boolean'
  })
  opened?: (item: Dict) => boolean;

  /** Get labels of an element. */
  @Field({
    type: 'PropField',
    propType: '(item: Dict) => string'
  })
  getLabel?: (item: Dict) => string;

  /** Whether to allow dragging or not. */
  @Field({
    type: 'PropField',
    propType: 'boolean | ((items: any) => boolean)'
  })
  draggable?: boolean | ((items: any) => boolean);

  /** Whether to allow sorting inside list with same group. */
  @Field({ type: 'CheckboxField' })
  moveable?: boolean;

  /** Expected callback to be called on select. */
  @Field(voidPropField)
  onSelect?: <T extends this>(options: PropOptions<T>) => void;

  /** 'onDragStart' gets triggered when the user starts to drag an element or text selection. */
  @Field({
    type: 'PropField',
    propType: '((event: DragEvent) => void)'
  })
  onDragStart?: (event: DragEvent) => void;

  /** 'onDragEnd' gets triggered when the user finish to drag an element or text selection. */
  @Field({
    type: 'PropField',
    propType: '((event: DragEvent) => void)'
  })
  onDragEnd?: (event: DragEvent) => void;

  /** Clone items not just a copy of the original model, but one that inherits the field values from the original model*/
  @Field({
    type: 'PropField',
    propType: '(item: any) => string'
  })
  cloneItem?: (item: any) => any;
}
