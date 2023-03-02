import { Field, View } from '..';
import { DataViewModel } from './data.view';

type StackedHeader = {
  fields: string[];
  title: string;
};

/** Kanban view model */
@View({
  name: 'kanbanView',
  parent: 'dataViews',
  extraFieldGroup: {
    label: 'Kanban options',
    headerClass: 'bg-blue-grey-2'
  }
})
export class KanbanViewModel extends DataViewModel {
  declare type?: 'KanbanView';

  name? = 'KanbanView';

  // Only ChoiceFieldModel.
  @Field()
  groupField?: string;

  @Field()
  headerField?: string;

  @Field()
  contentField?: string;

  // @Field()
  // swimlaneField?: string;

  stackedHeaders?: StackedHeader[];

  @Field({ type: 'CheckboxField' })
  showItemCount?: boolean;

  @Field({ type: 'CheckboxField' })
  showHeader?: boolean;

  @Field({ type: 'CheckboxField' })
  allowToggle?: boolean;

  @Field({ type: 'CheckboxField' })
  allowDragAndDrop?: boolean;

  @Field({ type: 'CheckboxField' })
  allowMultipleSelection?: boolean;
}
