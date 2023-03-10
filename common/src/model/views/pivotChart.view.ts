import { Field, View } from '../models/model.decorator';
import { PivotViewModel } from './pivot.view';

const draws = <const>[
  'Line',
  'Column',
  'Area',
  'Bar',
  'StackingColumn',
  'StackingArea',
  'StackingBar',
  'StackingLine',
  'StepLine',
  'StepArea',
  'SplineArea',
  'Scatter',
  'Spline',
  'StackingColumn100',
  'StackingBar100',
  'StackingArea100',
  'StackingLine100',
  'Bubble',
  'Pareto',
  'Polar',
  'Radar',
  'Pie',
  'Pyramid',
  'Doughnut',
  'Funnel'
];
const axisMode = <const>['Stacked', 'Single'];
const markerShapes = <const>[
  'Circle',
  'Rectangle',
  'Triangle',
  'Diamond',
  'HorizontalLine',
  'VerticalLine',
  'Pentagon',
  'InvertedTriangle',
  'Image'
];
const dataLabelPositions = <const>['Outer', 'Top', 'Bottom', 'Middle', 'Auto'];
const legendPositions = <const>['Top', 'Left', 'Bottom', 'Right'];

/** Pivot chart view model */
@View({
  name: 'pivotChartView',
  parent: 'views',
  extraFieldGroup: {
    label: 'Pivot Chart Options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class PivotChartViewModel extends PivotViewModel {
  declare type?: 'PivotChartView';
  name? = 'PivotChartView';

  /** It allows to set the type ('Line', 'Column', 'Bar' and etc.) of series to be drawn in radar or polar series. */
  @Field({
    type: 'SelectField',
    optionItems: draws,
    multiple: false
  })
  drawType?: typeof draws[number];

  /** Whether to allow showing marker or not.
   * If set to true the marker for series is rendered. This is applicable only for line and area type series. */
  @Field({ type: 'CheckboxField' })
  showMaker?: boolean;

  /** It sets the different shape ( 'Circle', 'Rectangle', 'Triangle' and etc.) of a marker.*/
  @Field({
    type: 'SelectField',
    optionItems: markerShapes,
    multiple: false,
    hidden({ data }) {
      return !data.showMaker;
    }
  })
  markerShape?: typeof markerShapes[number];

  /** Whether to allow showing data label or not.
   *  If set true, data label for series renders. */
  @Field({ type: 'CheckboxField' })
  showDataLabel?: boolean;

  /** It sets the position (Outer, top, bottom and etc.) of the data label. */
  @Field({
    type: 'SelectField',
    optionItems: dataLabelPositions,
    multiple: false,
    hidden({ data }) {
      return !data.showDataLabel;
    }
  })
  dataLabelPosition?: typeof dataLabelPositions[number];

  /** Whether to allow showing legend.
   * If set to true, legend will be visible. */
  @Field({ type: 'CheckboxField' })
  showLegend?: boolean;

  /** It sets the position ('Outer', 'Top', 'Bottom', 'Middle' and 'Auto') of the legend. */
  @Field({
    type: 'SelectField',
    optionItems: legendPositions,
    multiple: false,
    hidden({ data }) {
      return !data.showLegend;
    }
  })
  legendPosition?: typeof dataLabelPositions[number];

  /** Whether to show tooltip or not. */
  @Field({ type: 'CheckboxField' })
  showTooltip?: boolean;

  /** It sets the header for tooltip. */
  @Field({ type: 'StringField' })
  tooltipHeader?: string;

  /** Whether to allow showing crosshair tooltip. */
  @Field({ type: 'CheckboxField' })
  showCrosshair?: boolean;

  /** It allows the chart series to be displayed, depending on the value fields specified, in either a stacked or single chart area.
   *  stacked = Allows the chart series to be displayed in a separate chart area depending on the value fields specified.
   *  single = Allows the chart series to be displayed in a single chart area for different value fields. */
  @Field({
    type: 'SelectField',
    optionItems: axisMode,
    multiple: false
  })
  multipleAxisMode?: typeof axisMode[number];

  /** It sets the title of the pivot chart. */
  @Field({ type: 'StringField' })
  title?: string;

  /** It sets the title of the x axis (horizontal) pivot chart. */
  @Field({ type: 'StringField' })
  xAxisTitle?: string;

  /** It sets the title of the y axis (vertical) pivot chart. */
  @Field({ type: 'StringField' })
  yAxisTitle?: string;

  /** Whether to allow grid form in a pivot chart or not.
   *  Default to false. */
  @Field({
    type: 'CheckboxField',
    hidden: true
  })
  enableGrid?: boolean = false;

  /** Whether to allow chart form in a pivot chart or not.
   *  Default to true. */
  @Field({
    type: 'CheckboxField',
    hidden: true
  })
  enableChart?: boolean = true;
}
