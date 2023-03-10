import { Model, PropOptions } from '..';
import { Field, View } from './model.decorator';

/**
 * Navigation model
 */
@View({
  type: 'FormView',
  name: 'navigation',
  datasource: 'model',
  table: 'navigation',
  dataId: '-'
})
export class NavigationModel {
  @Field({
    type: 'PropField',
    propType: 'MenuItem[] | ((options: PropOptions<Model>) => MenuItem[])',
    cols: 12,
    inputField: {
      type: 'DataGridField',
      dataGridModel: { parent: 'menuItems' }
    }
  })
  listMenuItems?: MenuItem[] | ((options: PropOptions<Model>) => MenuItem[]);

  @Field()
  listMenuActions?: string[];

  @Field({
    type: 'PropField',
    propType: 'MenuItem[] | ((options: PropOptions<Model>) => MenuItem[])',
    cols: 12,
    inputField: {
      type: 'DataGridField',
      dataGridModel: { parent: 'menuItems' },
      height: '300px'
    }
  })
  tabMenuItems?: MenuItem[] | ((options: PropOptions<Model>) => MenuItem[]);

  @Field({ type: 'PropField', propType: 'string[]', cols: 12 })
  userMenuActions?: string[];

  @Field({ type: 'StringField', cols: 6 })
  tabMenuScreenLt?: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  @Field({ type: 'StringField', cols: 6 })
  indexRedirect?: string;
}

@View({
  name: 'menuItems',
  parent: 'models',
  noServer: true,
  columnFields: ['name', 'icon', 'label', 'path'],
  detailView: {
    type: 'FormView',
    viewActions: ['openPermission', 'submitForm'],
    formFields: ['name', 'icon', 'label', 'path', 'openInNewTab', 'children']
  }
})
export class MenuItem {
  @Field() name?: string;

  @Field({ type: 'IconField' })
  icon?: string | ((options: PropOptions<any>) => string);

  @Field() label?: string | ((options: PropOptions<any>) => string);

  /** Path refers to path of the URL */
  @Field() path?: string;

  /** It defines list of children menus under a parent menu.  */
  @Field({
    type: 'DataGridField',
    columnType: 'array',
    cols: 12,
    dataGridModel: {
      parent: 'menuItems',
      allowRowDragAndDrop: true,
      viewActions: ['openAdd', 'openEdit', 'openRemove', 'openPermission']
    }
  })
  children?: MenuItem[] | (<T extends this>(options: PropOptions<T>) => MenuItem[] | Promise<MenuItem[]>);

  /** Whether to show view in the menu bar or not.
   * TODO not implemented */
  @Field({
    type: 'PropField',
    inputField: { type: 'CheckboxField' },
    propType: 'boolean | (<T extends this>(options: PropOptions<T>) => boolean)'
  })
  visible?: boolean | (<T extends this>(options: PropOptions<T>) => boolean);

  @Field()
  acl?: string;

  /** Whether to open the view in a new tab or not.
   * TODO not implemented */
  @Field() openInNewTab?: boolean;

  @Field()
  actions?: string[];
}

export interface RouteParams {
  view: string;
  dataId?: string;
  childView?: string;
  childDataId?: string;
}
