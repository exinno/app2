import { Dict } from '../..';
import { dictsPropField, fieldsSelectField, PropFieldModel, PropOptions } from '..';
import { Field, View } from '../model.decorator';
import { DataViewModel } from './data.view';

const pivotFieldSelectField: PropFieldModel = {
  type: 'PropField',
  propType: '(options: PropOptions<any>) => string[]',
  inputField: {
    type: 'SelectField',
    ...fieldsSelectField,
    optionItems: ({ data }) => data.fields?.filter((field) => field.type != 'LookupField')
  }
};

/** Pivot view model */
@View({
  name: 'pivotView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Pivot Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class PivotViewModel extends DataViewModel {
  declare type?: 'PivotView' | 'PivotChartView';
  name? = 'PivotView';

  /** Column fields define list of columns to be shown in the view.
   *  Column shows in the view by order listed in 'columnFields'. */
  @Field(pivotFieldSelectField)
  columnFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  /** Row fields define list of rows to be selected in a pivot report. */
  @Field(pivotFieldSelectField)
  rowFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  /** List of values to be shown in a pivot report.
   *  TODO value not showing when 1 value selected.  */
  @Field(pivotFieldSelectField)
  valueFields?: string[] | (<T extends this>(options: PropOptions<T>) => string[]);

  @Field({ type: 'CheckboxField' })
  allowFiltering?: boolean = true;

  @Field({ type: 'CheckboxField' })
  allowRowDragAndDrop?: boolean = false;

  /** Label for values with null. */
  @Field({ type: 'StringField' })
  nullLabel?: string;

  /** Whether to allow grid form in a pivot report or not.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  enableGrid?: boolean = true;

  /** Whether to allow chart form in a pivot report or not.
   *  Defaults to false. */
  @Field({ type: 'CheckboxField' })
  enableChart?: boolean = false;

  /** Whether to allow pivot table to be exported as an Excel document. Can be exported in XLSX, CSV and PDF formats.
   *  Can use it by clicking on export button in toolbar.
   *  Both 'allowExcelExport' and 'showToolbar' need to be true to use export.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowExcelExport?: boolean = false;

  /** Whether to allow showing the conditional formatting and the number formatting pop-up that used to apply formatting to the values in the component.
   *  Can use it by clicking on formatting button in toolbar.
   *  Both 'allowFormatting' and 'showToolbar' need to be true to use formatting.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowFormatting?: boolean = true;

  /** Whether to allow sorting of records when column header is clicked.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  allowSorting?: boolean = true;

  /** Whether to allow built-in popup field list to be enabled in the pivot report UI.
   *  It helps to manipulate the pivot report data in many different ways. */
  @Field({ type: 'CheckboxField' })
  showFieldList?: boolean = true;

  /** Whether to allow viewing the underlying raw data of a summarized cell in the pivot report.
   *  Double-clicking on value cell, allows user to view detailed raw data in a new window.
   *  In the new window, row header, column header and measure name of the clicked cell will be shown at the top.
   *  Users can also include or exclude fields available in the view using column chooser option. */
  @Field({ type: 'CheckboxField' })
  allowDrillThrough?: boolean = true;

  /** Whether to allow exporting in PDF format or not.
   *  Can use it by clicking on export button in toolbar.
   *  Both 'allowExcelExport', 'showToolbar' and 'allowPdfExport' need to be true to use PDF export.
   *  Defaults to true.
   * TODO always true? */
  @Field({ type: 'CheckboxField' })
  allowPdfExport?: boolean = true;

  /** Whether to allow showing the grouping UI in the pivot report that automatically groups date, time, number and string at runtime
   *  Right clicking on the pivot table’s row or column header, select 'Group'.
   *  This will show a dialog in which user can perform grouping with appropriate options to group the data.
   *  To ungroup, right click on the pivot table’s row or column header, select 'Ungroup'.
   * TODO always true? Right click column header error */
  @Field({ type: 'CheckboxField' })
  allowGrouping?: boolean = true;

  /** Whether to allow showing toolbar in the top of pivot report.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  showToolbar?: boolean = true;

  /** Whether allow showing grouping bar UI in the pivot table that automatically populates fields from the bound report.
   *  It also allows user to modify the report with a variety of actions using the pivot buttons to update the pivot table during runtime.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  showGroupingBar?: boolean = true;

  /** Whether to allow showing grand totals in both rows and columns axis of the pivot table.
   *  Defaults to true. */
  @Field({ type: 'CheckboxField' })
  showGrandTotals?: boolean = true;

  /** It allows a collection of values fields to change the appearance of the pivot table value cells with different style properties
   *  such as background color, font color, font family, and font size based on specific conditions. */
  @Field(dictsPropField)
  conditionalFormatSettings?: Dict[];
}
