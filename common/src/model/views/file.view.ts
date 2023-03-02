import { View } from '../model.decorator';
import { ViewModel, ViewProps, ViewService, WebActionModel } from '..';

/** File view model */
@View({
  name: 'fileView',
  parent: 'views'
})
export class FileViewModel extends ViewModel<FileViewService> {
  declare type?: 'FileView';

  name? = 'FileView';

  viewActions? = ['saveFile'];

  webActions?: WebActionModel<FileViewService, this>[] = [
    {
      name: 'saveFile',
      label: 'Save',
      icon: 'mdi-content-save',
      actionType: 'overall',
      execute: async ({ viewService, registry: { uiService } }) => {
        uiService.showLoading(0);
        setTimeout(async () => {
          try {
            await viewService.saveFile();
          } finally {
            uiService.hideLoading();
          }
        }, 10);
      }
    },
    {
      name: 'saveAsFile',
      label: 'Save as',
      icon: 'mdi-content-save-edit',
      actionType: 'overall',
      execute: ({ viewService }) => {
        //
      }
    }
  ];
}

export abstract class FileViewService<T = FileViewModel> extends ViewService<T> {
  constructor(protected props: ViewProps<T>) {
    super(props);
  }

  abstract saveFile(): Promise<void>;

  abstract loadFile(content: Blob): Promise<void>;
}
