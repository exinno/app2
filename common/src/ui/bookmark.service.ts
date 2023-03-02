import { registry, DataService, AuthService, ViewService } from '..';
import { Bookmark } from './bookmarks';

export class BookmarkService {
  constructor(private dataService: DataService, private authService: AuthService) {}

  readonly bookmarks: Bookmark[] = [];

  async init() {
    if (!this.authService.user) return;
    const bookmarks = await this.dataService.getAll<Bookmark>({
      view: 'bookmarks',
      select: ['label', 'path'],
      filter: { field: 'owner', value: this.authService.user?.id }
    });
    this.bookmarks.length = 0;
    this.bookmarks.push(...bookmarks.map((bookmark) => ({ ...bookmark, actions: ['bookmarkView'] })));
  }

  isBookmarked(bookMark?: Bookmark): boolean {
    const path = bookMark?.path ?? registry.router.currentRoute.value.path;
    const bookmarked = !!this.bookmarks?.find((bookmark) => bookmark.path == path);
    return bookmarked;
  }

  async remove(path: string) {
    await this.dataService.remove({
      view: 'bookmarks',
      filter: {
        filters: [
          { field: 'path', value: path },
          { field: 'owner', value: this.authService.user.id }
        ]
      }
    });
    void this.init();
  }

  async create(bookmark: Bookmark) {
    await this.dataService.create({
      view: 'bookmarks',
      data: bookmark
    });
    void this.init();
  }

  async toggle(viewService: ViewService, bookmark?: Bookmark) {
    const { router, messageService, modelService } = registry;
    const path = bookmark?.path ?? router.currentRoute.value.path;

    if (this.isBookmarked()) {
      await this.remove(path);
    } else {
      let label = messageService.getLabel(viewService.model, 'views', { viewService });
      const subLabel = modelService.callProp(viewService.model, 'subLabel', { viewService });
      if (subLabel) label = `${label} (${subLabel})`;
      const bookmark: Bookmark = { path, label: label, isFolder: false };
      await this.create(bookmark);
    }
  }
}
