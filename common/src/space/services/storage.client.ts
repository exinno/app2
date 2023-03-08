import axios from 'axios';
import {
  downloadFile,
  uploadFile,
  UiService,
  DataService,
  DataViewService,
  asSingle,
  asArray,
  AttachmentViewService,
  FileViewModel,
  PropOptions,
  constants
} from '../..';
import { File } from '../views/files';

type UploadingFile = {
  name: string;
  progressValue: number;
  size: number;
  status: 'ing' | 'done' | 'fail';
  contentType: string;
};

export class StorageClient {
  constructor(private dataService: DataService, private uiService: UiService) {}
  uploadingFiles: UploadingFile[] = [];

  async getFile(fileId: string): Promise<File> {
    const file = await this.dataService.get<File>({
      view: 'files',
      dataId: fileId,
      params: { ancestors: true }
    });
    if (!file) throw new Error(`${fileId} file not found`);
    return file;
  }

  async upload(folderId: string, files: FileList, viewService: DataViewService): Promise<string[]> {
    for (let i = 0; i < files.length; i++) {
      this.uploadingFiles.push({
        name: files[i].name,
        progressValue: 0,
        size: files[i].size,
        status: 'ing',
        contentType: files[i].type
      });
    }
    this.openUploadProgress(viewService);
    const fileIds = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = await this.uploadFile(file, undefined, folderId, viewService);
      fileIds.push(fileId);
    }
    return fileIds;
  }

  async openUpload(folderId: string, viewService: DataViewService): Promise<string[]> {
    return new Promise((resolve) =>
      uploadFile(async (event) => {
        if (!event.target.files) return resolve([]);
        const fileIds = await this.upload(folderId, event.target.files, viewService);
        resolve(fileIds);
      })
    );
  }
  private async uploadFile(
    file: globalThis.File,
    fileId?: string,
    folder?: string,
    viewService?: DataViewService
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    let url = '/api/storage/files';
    if (fileId) url += '/' + fileId;
    const item = this.uploadingFiles.find((item) => item.name === file.name);

    let dataView = undefined;
    let dataId = undefined;

    if (viewService?.selectedData?.id) {
      dataView = viewService?.serverView;
      dataId = viewService?.dataId;
    }

    try {
      const response = await axios.post(url, formData, {
        params: { folder, dataView, dataId },
        onUploadProgress: (p: ProgressEvent) => {
          if (item) {
            item.progressValue = parseInt(((p.loaded / p.total) * 100).toString());
            if (p.loaded === p.total) {
              item.status = 'done';
            }
          }
        }
      });
      return response.data;
    } catch (error) {
      item.status = 'fail';
    }
  }

  download(fileId: string) {
    downloadFile(this.getUrl(fileId));
  }

  refresh() {
    this.uploadingFiles = [];
  }

  async getFileData(file: File): Promise<globalThis.File> {
    if (!file.id) throw new Error('file.id is undefined');

    const url = this.getUrl(file.id);
    const response = await fetch(url);
    const blob = await response.blob();
    return new window.File([blob], file.name);
  }

  private getUrl(fileId: string): string {
    return '/api/storage/files/' + fileId;
  }

  private contentTypeIcons = {
    vue: 'mdi-vuejs',
    js: 'mdi-language-javascript',
    ts: 'mdi-language-typescript',
    java: 'mdi-language-java',
    zip: 'mdi-folder-zip',
    md: 'mdi-language-markdown',
    html: 'mdi-language-html5',
    htm: 'mdi-language-html5',
    diagram: 'mdi-set-none',
    '7z': 'mdi-folder-zip',
    'application/vnd.ms-powerpoint': 'mdi-microsoft-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml': 'mdi-microsoft-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml': 'mdi-microsoft-word',
    'application/msword': 'mdi-microsoft-word',
    'application/vnd.openxmlformats-officedocument.spreadsheetml': 'mdi-microsoft-excel',
    'application/vnd.ms-excel': 'mdi-microsoft-excel',
    'application/vnd.ms-access': 'mdi-microsoft-access',
    'application/pdf': 'mdi-file-pdf-box',
    'application/x-msdownload': 'mdi-application-cog',
    'application/x-zip-compressed': 'mdi-folder-zip',
    'application/vnd.google-apps.presentation': 'mdi-presentation',
    'application/vnd.google-apps.document': 'mdi-file-document',
    'application/vnd.google-apps.spreadsheet': 'mdi-file-excel',
    'application/': 'mdi-application',
    'image/': 'mdi-image',
    'text/': 'mdi-text',
    'audio/': 'mdi-speaker',
    'video/': 'mdi-video'
  };

  getIcon(file: File): string {
    const ext = file.name.split('.').pop();

    if (file.isFolder) {
      return 'mdi-folder';
    } else if (this.contentTypeIcons[ext]) {
      return this.contentTypeIcons[ext];
    } else if (file.contentType) {
      const contentType = Object.keys(this.contentTypeIcons).find((key) => file.contentType?.indexOf(key) === 0);
      return this.contentTypeIcons[contentType];
    } else {
      return 'mdi-help-box';
    }
  }

  private viewComponents: { [key: string]: string } = {
    xlsx: 'SheetView',
    xls: 'SheetView',
    csv: 'SheetView',
    sheet: 'SheetView',
    doc: 'DocumentView',
    docx: 'DocumentView',
    rtf: 'DocumentView',
    sfdt: 'DocumentView',
    pdf: 'PdfView',
    md: 'MarkdownEditorView',
    html: 'MarkdownEditorView',
    diagram: 'DiagramView',
    jpeg: 'ImageEditorView',
    jpg: 'ImageEditorView',
    png: 'ImageEditorView'
  };

  getViewComponent(file: File): string {
    return this.viewComponents[file.name.split('.').pop().toLowerCase()];
  }

  async openView(file: File, viewService?: DataViewService) {
    let fileData: globalThis.File;
    if (file.contentSize) fileData = await this.getFileData(file);
    await this.uiService.openModal({
      view: {
        type: 'FileView',
        component: this.getViewComponent(file),
        label: file.name,
        onDataChange: async ({ data }) => {
          if (file.id) await this.uploadFile(data, file.id);
          else {
            const fileData = new globalThis.File([data], file.name);
            await this.uploadFile(fileData, null, file.folder);
          }
        },
        hideViewActionsLabel: true,
        viewActions: ['downloadFile', 'saveFile'],
        webActions: [
          {
            name: 'downloadFile',
            label: 'Download',
            icon: 'mdi-download-outline',
            execute: ({ selectedId }) => {
              this.download(asSingle(selectedId));
            }
          }
        ]
      } as FileViewModel,
      data: fileData,
      dataId: file.id,
      parentView: viewService,
      pageCtx: { fileName: file.name },
      openSize: 'maximized'
    });
  }

  async openAttachAnyView(viewService: AttachmentViewService) {
    await this.uiService.openModal({
      view: {
        parent: viewService.model.selectView,
        viewActions: ['attachItem'],
        webActions: [
          {
            name: 'attachItem',
            label: 'Attach',
            icon: 'mdi-attachment-plus',
            execute: async ({ selectedId }: PropOptions<any>) => {
              const selectedIds = asArray(selectedId);
              await this.saveAttachments(viewService, selectedIds);
              this.uiService.close();
            }
          }
        ]
      },
      parentView: viewService,
      openSize: 'full',
      pageCtx: { spaceId: 'everything' }
    });
  }

  async uploadLocalFileAttach(viewService: AttachmentViewService): Promise<string[]> {
    return new Promise((resolve) => {
      uploadFile(async (event) => {
        if (event.target.files) {
          try {
            const selectedIds = await this.uploadAttachments(viewService, event.target.files);
            resolve(selectedIds);
          } catch (error) {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    });
  }

  async openCameraAttach(viewService: AttachmentViewService) {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      alert('Available on mobile devices only.');
      return;
    }

    return new Promise((resolve) => {
      uploadFile(async (event) => {
        if (event.target.files) {
          try {
            const selectedIds = await this.uploadAttachments(viewService, event.target.files);
            resolve(selectedIds);
          } catch (error) {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      }, 'camera');
    });
  }

  private async uploadAttachments(viewService: AttachmentViewService, files: FileList): Promise<string[]> {
    if (!viewService || !viewService.pageCtx) throw new Error('viewService is undefined');
    const defaultFolder = await this.getDefaultSpaceAttachmentFolder(viewService.pageCtx.spaceId);
    const selectedIds: string[] = await this.upload(defaultFolder.id, files, viewService);
    await this.saveAttachments(viewService, selectedIds);
    return selectedIds;
  }

  private async saveAttachments(viewService: AttachmentViewService, selectedIds: string[]) {
    for (const selectedId of selectedIds) {
      await this.dataService.save({
        view: 'attachments',
        data: {
          dataView: viewService.model.serverView,
          dataId: viewService.dataId,
          attachField: viewService.model.attachField,
          attachedId: selectedId,
          attachView: viewService.model.attachView
        }
      });
    }
  }

  private openUploadProgress(viewService: DataViewService) {
    void this.uiService.openView({
      view: {
        type: 'CustomView',
        component: 'UploadProgress',
        hideToolbar: true,
        containerProps: {
          seamless: true,
          position: 'bottom'
        }
      },
      openType: 'modal',
      parentView: viewService,
      data: this.uploadingFiles
    });
  }

  async getDefaultSpaceAttachmentFolder(spaceId: string): Promise<File> {
    const folder = await this.dataService.get<File>({
      view: 'files',
      dataId: spaceId.toString().concat(constants.DEFAULT_SPACE_ATTACHMENT_FOLDER_SUFFIX),
      filter: { space: spaceId }
    });
    if (folder && folder.id) return folder;

    const space = await this.dataService.get({ view: 'spaces', dataId: spaceId });
    const folderId = space.id.toString().concat(constants.DEFAULT_SPACE_ATTACHMENT_FOLDER_SUFFIX);
    await this.dataService.create<File>({
      view: 'files',
      data: {
        id: folderId,
        name: 'Attached Files',
        isFolder: true,
        space: space.id,
        storage: space.storage,
        folder: space.id,
        allowDuplicateFileNames: true,
        isImmutable: true
      }
    });
    const createdFolder = await this.dataService.get<File>({ view: 'files', dataId: folderId });
    if (!createdFolder) throw new Error(`${folderId} files(folder) not found`);
    return createdFolder;
  }
}
