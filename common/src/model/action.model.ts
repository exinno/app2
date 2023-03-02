import { ViewService } from '..';
import { DataViewModel, DataViewService, Model, PropOptions, ServerPropOptions, ViewModel } from '.';
import { ChangeType, Permission, permissions } from '../data';
import { Field, View } from './model.decorator';

const actionTypes = ['single', 'multiple', 'overall'] as const;
export type ActionType = typeof actionTypes[number];

/**
 * Action model
 */
@View({
  name: 'actions',
  parent: 'models',
  formFields: ['name', 'icon', 'label', 'category', 'actionType', 'disabled', 'execute'],
  columnFields: ['name', 'icon', 'label', 'category', 'actionType'],
  viewActions: [
    'openAdd',
    'openEdit',
    'openRemove',
    'testExecute',
    'openQueryBuilder',
    'exportExcel',
    'openActivities',
    'refresh'
  ],
  webActions: [
    {
      name: 'testExecute',
      label: 'Test Execute',
      icon: 'mdi-play',
      actionType: 'single',
      execute: (options) => {
        const actionModel = options.data;
        actionModel.execute(options);
      }
    }
  ]
})
export abstract class ActionModel<
  S extends ViewService = ViewService,
  V extends ViewModel<S> = ViewModel<S>
> extends Model<S, V> {
  /** ActionType property represent whether web action can be triggered when single item is selected or multiple items are selected or overall (does not have to be selected). */
  @Field({
    type: 'SelectField',
    optionItems: actionTypes
  })
  actionType?: ActionType;

  /** Permission property refers to whether user has the right to execute certain defined events.
   *  Permission property can be defined in 'acls' screen. (Only user with the right to access ). */
  @Field({
    type: 'SelectField',
    optionItems: permissions
  })
  permission?: Permission;

  /** Whether to put actions in disabled mode or not. */
  @Field({
    type: 'PropField',
    propType: 'boolean | ((options: PropOptions<ActionModel>) => boolean)',
    cols: 12,
    height: '200px'
  })
  disabled?: boolean | ((options: PropOptions<ActionModel, S, V>) => boolean);

  /** Whether action is hidden or not.
   *  Action with hidden property as true does not appear on view.
   *  Defaults to false. */
  @Field({
    type: 'PropField',
    propType: 'boolean | ((options: PropOptions<ActionModel>) => boolean)',
    cols: 12,
    height: '200px'
  })
  hidden?: boolean | ((options: PropOptions<ActionModel, S, V>) => boolean);

  /** Whether to put action button in ellipsis (⋮). */
  @Field({
    type: 'PropField',
    propType: 'boolean | ((options: PropOptions<ActionModel>) => boolean)',
    cols: 12
  })
  ellipsis?: boolean | ((options: PropOptions<ActionModel, S, V>) => boolean);

  /** Shortcut key used to execute actions. */
  shortcutKey?: string;

  @Field({ type: 'IconField' })
  dropdownIcon?: string | (<T extends this>(options: PropOptions<T>) => string);

  @Field({
    type: 'PropField',
    propType: 'boolean | ((options: PropOptions<ActionModel, S, V>) => boolean)',
    cols: 12,
    height: '200px'
  })
  selected?: boolean | ((options: PropOptions<ActionModel, S, V>) => boolean);

  @Field({
    type: 'PropField',
    propType: 'string | ((options: PropOptions<ActionModel, S, V>) => string)',
    cols: 12
  })
  badgeValue?: string | ((options: PropOptions<ActionModel, S, V>) => string);
}

/** Server action model */
@View({
  name: 'serverActions',
  table: 'serverActions',
  parent: 'actions'
})
export class ServerActionModel<
  S extends ViewService = ViewService,
  V extends ViewModel<S> = ViewModel<S>
> extends ActionModel<S, V> {
  changeType?: ChangeType;

  /** Expected web action callback to be called on clicking button. */
  @Field({
    type: 'PropField',
    propType: '(options: ServerPropOptions) => any',
    cols: 12,
    height: '400px'
  })
  execute?: (options: ServerPropOptions) => any;
}

/** Web actions model */
@View({
  name: 'webActions',
  table: 'webActions',
  parent: 'actions'
})
export class WebActionModel<
  S extends ViewService = ViewService,
  V extends ViewModel<S> = ViewModel<S>
> extends ActionModel<S, V> {
  /** Expected web action callback to be called on clicking button. */
  @Field({
    type: 'PropField',
    propType: '(options: PropOptions<ActionModel>) => any',
    cols: 12,
    height: '400px'
  })
  execute?: (options: PropOptions<ActionModel, S, V>) => any;

  @Field({
    type: 'PropField',
    propType: 'string[]'
  })
  children?: string[];
}

export type DataWebActionModel = WebActionModel<DataViewService, DataViewModel>;
