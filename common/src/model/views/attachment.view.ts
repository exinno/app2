import { Field, View, ViewProps } from '..';
import { ListViewModel } from './list.view';
import { DataViewService } from './data.view';

@View({
  name: 'attachmentView',
  parent: 'dataViews'
})
export class AttachmentViewModel extends ListViewModel {
  declare type?: 'AttachmentView';

  name? = 'AttachmentView';

  label = 'Attachment';

  @Field()
  hideAction = true;

  @Field()
  hideToolbar = true;

  @Field()
  noEllipsis = true;

  @Field()
  multiple = true;

  //(필수) 첨부파일을 보여 줄 form field 의 이름
  @Field()
  attachField: string;

  //(필수) 첨부파일의 원래 view 이름
  @Field()
  attachView: string;

  //(필수) 첨부팔 대상의 serverView 이름
  @Field()
  selectView: string;

  //(필수) 첨부 목록에서 보여질 listView 이름
  @Field()
  listView: string;

  //(필수) 현재 data 의 view 이름
  @Field()
  serverView: string;
}

export class AttachmentViewService<T = AttachmentViewModel> extends DataViewService<T> {
  constructor(protected props: ViewProps<T>) {
    super(props);
  }
}
