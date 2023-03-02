import { DataGridViewModel } from 'app2-common';

export const crmBase: DataGridViewModel = {
  type: 'DataGridView',
  parent: 'editable',
  editMode: 'Batch',
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  acl: 'ownerAny',
  aclByRecord: true,
  ownerField: 'createdBy',
  hintMode: 'tooltip',
  mobileView: {
    type: 'ListView',
    itemClickAction: 'openEdit'
  }
};
