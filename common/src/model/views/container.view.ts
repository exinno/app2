import { AnyViewModel, PropOptions, ViewService } from '..';
import { Field, View } from '../model.decorator';
import { ViewModel, WebActionModel } from '..';

/** Container view */
@View({
  name: 'containerView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Container Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class ContainerViewModel extends ViewModel<ContainerViewService> {
  name? = 'ContainerView';

  declare webActions?: WebActionModel<ContainerViewService, this>[];

  /** Children of the view. Basically, view can have multiple children view with different types and properties. */
  @Field({
    type: 'ModalViewField',
    columnType: 'array',
    icon: 'mdi-tab',
    openSize: 'maximized',
    view: {
      label: 'Children',
      type: 'DataGridView',
      parent: 'views',
      noServer: true,
      detailView: {
        type: 'FormView',
        parent: 'views'
      }
    },
    validate: ({ value }) => !!value?.length || 'Least one child is required for ContainerView.'
  })
  children?: (AnyViewModel | string)[] | (<T extends this>(options: PropOptions<T>) => (AnyViewModel | string)[]) = [];

  /** Whether child of the view should be vertically separated.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' }) vertical?: boolean = false;
}

export interface ContainerViewService extends ViewService<ContainerViewModel> {
  children?: ViewService[];
}
