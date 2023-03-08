import { DataViewService, Dict } from '../..';
import { dictPropField, fieldsSelectField, OpenViewModel, PropOptions, WebActionModel } from '..';
import { Field, View } from '../model.decorator';
import { DataViewModel } from './data.view';

const selectionModes = ['Cell', 'Row'] as const;
export type SelectionMode = typeof selectionModes[number];

const editModes = ['Normal', 'Batch', 'Dialog'] as const;
export type EditMode = typeof editModes[number];

const filterTypes = ['FilterBar', 'Excel', 'Menu', 'CheckBox'] as const;
export type FilterType = typeof filterTypes[number];

/** Data Grid base view model */
@View({
  name: 'gridBaseView',
  parent: 'dataViews'
})
export class GridBaseViewModel extends DataViewModel {
  /** Column fields define list of columns to be shown in the view.
   *  Column shows in the view by order listed in 'columnFields'. */
  @Field(fieldsSelectField)
  columnFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  /** Users can choose 'selectionMode' between 'Row' and 'Box'.
   *  row = Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
   *  box = Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
   *  Defaults to 'Row'. */
  @Field({ type: 'SelectField', optionItems: selectionModes })
  selectionMode?: SelectionMode = 'Row';

  /** Whether to allow selection of records by clicking it.
   *  When 'actionType' is set to 'single' or 'multiple', 'allowSelection' must be true.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowSelection?: boolean = true;

  /** Whether to allow selection of multiple records by clicking it.
   *  When 'actionType' is set to 'single' or 'multiple', 'allowMultipleSelection' must be true.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowMultipleSelection?: boolean = true;

  /** Whether to allow sorting of records when column header is clicked.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowSorting?: boolean = true;

  /** Whether to allow grid column resizing.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowResizing?: boolean = true;

  /** Whether to allow grouped elements to be reordered.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowReordering?: boolean = true;

  /** Whether to allow user with right permission to update record.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  allowEditing?: boolean = false;

  /** Whether to allow user with right permission to add record.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  allowAdding?: boolean = false;

  /** Whether to allow user with right permission to delete record.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  allowDeleting?: boolean = false;

  /** Whether to allow drag and drop grid rows at another grid.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  allowRowDragAndDrop?: boolean = false;

  /** Whether to allow filter records with required criteria.
   *  Filter bar will appear if its true.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowFiltering?: boolean = true;

  @Field({ type: 'SelectField', optionItems: filterTypes })
  filterType?: FilterType = 'Excel';

  /** Whether to allow column menu options in each columns.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  showColumnMenu?: boolean = true;

  @Field({ type: 'CheckboxField' })
  autoFitColumns?: boolean = false;
}

/** Data grid view model */
@View({
  name: 'dataGridView',
  parent: 'gridBaseView',
  extraFieldGroup: {
    label: 'Data Grid Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class DataGridViewModel extends GridBaseViewModel {
  declare type?: 'DataGridView' | 'TreeGridView';
  name? = 'DataGridView';

  @Field(fieldsSelectField)
  groupingFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  /** Whether to dynamically show or hide columns.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  showColumnChooser?: boolean = false;

  /** Whether to allow users to sort multiple column in the grid.
   *  'allowSorting' must be true.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowMultiSorting?: boolean = true;

  /** Whether to allow users to dynamically group or ungroup columns.
   *  Grouping can be done by drag and drop columns from column header to group drop area.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  allowGrouping?: boolean = false;

  @Field({ type: 'CheckboxField' })
  showGroupDropArea?: boolean;

  /** Whether to allow the pager renders at the footer of the grid.
   *  It is used to handle page navigation in the grid.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowPaging?: boolean = true;

  /** Whether to allow data loading in grid when the scrollbar reaches the end.
   *  It helps to load large dataset in grid.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  enableInfiniteScrolling?: boolean = false;

  /** Choose type of mode(normal, batch, dialog) used to edit data in view.
   *  Defaults to 'Modal'. */
  @Field({ type: 'SelectField', optionItems: editModes })
  editMode?: EditMode | any = 'Modal';

  /** Number of records loaded in one page. */
  @Field({ type: 'NumberField' })
  pageSize?: number = 20;

  autoPageSize?: boolean = false;

  /** It renders 'DropDownList' in the pager which allow users to select 'pageSize' from 'DropDownList'.
   *  Defaults to true. */
  @Field({
    type: 'PropField',
    defaultValue: true,
    propType: 'boolean | (number | string)[]'
  })
  pageSizes?: boolean | (number | string)[] = true;

  /** Properties to set when a cell in a grid record has changed. */
  @Field(dictPropField)
  changedCellStyle?: Dict;

  detailView?: OpenViewModel | string = {
    type: 'FormView'
  };

  viewActions?: string[] | (<T extends this>(options: PropOptions<T>) => string[]) = [
    'openAdd',
    'openEdit',
    'openRemove',
    'openQueryBuilder',
    'exportExcel',
    'openActivities',
    'designView',
    'editFields',
    'addField',
    'generateTestData',
    'refresh'
  ];

  webActions?: WebActionModel<DataGridService, this>[] = [
    {
      name: 'openQueryBuilder',
      label: 'Filter',
      icon: 'mdi-filter-variant',
      actionType: 'overall',
      execute: ({ registry: { uiService }, viewService }) => {
        void uiService.openModal({
          view: {
            type: 'QueryBuilderView',
            label: 'Filter Builder',
            width: '700px'
          },
          parentView: viewService
        });
      }
    },
    {
      name: 'openFilter',
      label: 'Filter',
      icon: 'mdi-filter-variant',
      actionType: 'overall',
      execute: ({ registry: { uiService }, viewService }) => {
        void uiService.openModal({
          view: {
            parent: 'dataFilter',
            data: (viewService as any).filter ?? []
          },
          parentView: viewService
        });
      }
    },
    {
      name: 'openGroup',
      label: 'Group',
      icon: 'mdi-format-line-style',
      actionType: 'overall',
      execute: async ({ registry: { uiService }, viewService }) => {
        const resultData = await uiService.openModal({
          view: {
            parent: 'dataGroup',
            data: []
          },
          parentView: viewService
        });

        (viewService as any).setGroup({
          groups: resultData.rowGroupView,
          valueFields: resultData.valueColumnView
        });
      }
    },
    {
      name: 'exportExcel',
      label: 'Export Excel',
      icon: 'mdi-microsoft-excel',
      actionType: 'overall',
      permission: 'export',
      ellipsis: true,
      execute: ({ viewService }) => {
        viewService.exportExcel();
      }
    },
    {
      name: 'exportPdf',
      label: 'Export Pdf',
      icon: 'mdi-file-pdf-box',
      actionType: 'overall',
      permission: 'export',
      ellipsis: true,
      execute: ({ viewService }) => {
        viewService.exportPdf();
      }
    }
  ];

  /** #################    properties for TreeGrid begin     ####################*/

  @Field({ type: 'CheckboxField' })
  isTreeGrid?: boolean;

  @Field({ type: 'StringField' })
  parentDataField?: string;

  @Field({ type: 'StringField' })
  childDataField?: string;

  @Field({ type: 'NumberField' })
  treeColumnIndex?: number;

  @Field({ type: 'CheckboxField' })
  loadChildOnDemand?: boolean;
  /** properties for TreeGrid end */
}

export interface DataGridService extends DataViewService {
  model: DataGridViewModel;

  exportExcel?(): void;

  exportPdf?(): void;
}
