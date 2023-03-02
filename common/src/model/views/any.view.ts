import {
  ChartViewModel,
  ChatbotViewModel,
  ChatViewModel,
  CustomViewModel,
  LogViewModel,
  DashboardViewModel,
  DataGridViewModel,
  FormViewModel,
  ListViewModel,
  NestedListViewModel,
  PivotChartViewModel,
  PivotViewModel,
  QueryBuilderViewModel,
  ScriptViewModel,
  SectionViewModel,
  SplitViewModel,
  TabViewModel,
  TreeViewModel,
  HtmlViewModel,
  MarkdownViewModel,
  FileViewModel,
  KanbanViewModel,
  CalendarViewModel,
  TimelineViewModel,
  CommentViewModel,
  AttachmentViewModel
} from '.';

export type AnyViewModel =
  | ChatbotViewModel
  | ChatViewModel
  | CustomViewModel
  | DashboardViewModel
  | DataGridViewModel
  | FormViewModel
  | ListViewModel
  | NestedListViewModel
  | PivotViewModel
  | PivotChartViewModel
  | QueryBuilderViewModel
  | ScriptViewModel
  | SectionViewModel
  | SplitViewModel
  | TabViewModel
  | ChartViewModel
  | TreeViewModel
  | HtmlViewModel
  | MarkdownViewModel
  | LogViewModel
  | FileViewModel
  | KanbanViewModel
  | CalendarViewModel
  | TimelineViewModel
  | CommentViewModel
  | AttachmentViewModel;

export type ViewType = AnyViewModel['type'];
