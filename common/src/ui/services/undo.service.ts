import { DataViewService } from '../..';
import _ from 'lodash';

export class UndoService {
  constructor(private viewService: DataViewService) {}

  maxStack = 100;
  undoBlocked = false;
  undoStack: any[] = [];
  redoStack: any[] = [];
  oldData: any;

  undo() {
    const data = this.undoStack.shift();
    if (data !== void 0) {
      this.undoBlocked = true;
      this.viewService.data = data;
    }
  }

  redo() {
    const data = this.redoStack.shift();
    if (data !== void 0) {
      this.undoBlocked = false;
      this.viewService.data = data;
    }
  }

  checkStack(stack: any[]) {
    if (stack.length > this.maxStack) {
      stack.splice(this.maxStack);
    }
  }

  clearStack(stack: any[]) {
    stack.splice(0);
  }

  onDataChange = _.debounce((newData) => {
    if (this.oldData) {
      if (this.undoBlocked === false) {
        // comes from redo
        this.undoStack.unshift(this.oldData);
      } else {
        // comes from undo
        this.redoStack.unshift(this.oldData);
      }

      // check stacks
      this.checkStack(this.undoStack);
      this.checkStack(this.redoStack);
      this.undoBlocked = false;
    }
    if (newData) this.oldData = { ...newData };
  }, 200);
}
