import { Field, View, WebActionModel } from '..';
import { ContainerViewModel } from './container.view';

type Panel = {
  header?: string;
  cssClass?: string;
  enabled?: boolean;
  minSizeX?: number;
  minSizeY?: number;
  maxSizeX?: number;
  maxSizeY?: number;
  sizeX: number;
  sizeY: number;
  row: number;
  col: number;
  zIndex?: number;
};

/** Dashboard view */
@View({
  name: 'dashboardView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Dashboard options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class DashboardViewModel extends ContainerViewModel {
  declare type?: 'DashboardView';
  name? = 'DashboardView';

  /** Whether to allow resizing or not. Grid columns can be resized if its true.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowResizing?: boolean = true;

  /** It defines number of columns to be created in the dashboard layout.
   *  Defaults to 3. */
  @Field({ type: 'NumberField' })
  columns?: number = 3;

  /** It defines the cell aspect ratio of the panel. */
  @Field({ type: 'NumberField' })
  aspectRatio?: number;

  /** List of panels property of the dashboard layout component. */
  @Field({
    type: 'PropField',
    propType: 'Panel[]'
  })
  panels?: Panel[];

  /** It defines the spacing between the panels. */
  @Field({
    type: 'PropField',
    propType: '[number, number]'
  })
  cellSpacing?: [number, number];

  viewActions? = ['removePanel', 'designView'];

  webActions?: WebActionModel[] = [
    {
      name: 'addPanel',
      label: 'Add',
      icon: 'mdi-plus',
      actionType: 'overall',
      execute: ({ viewService }) => {
        (viewService as any).addPanel();
      }
    },
    {
      name: 'removePanel',
      label: 'remove',
      icon: 'mdi-minus',
      actionType: 'single',
      execute: ({ selectedData: data, viewService }) => {
        (viewService as any).removePanel(data);
      }
    }
  ];
}
