import { DataGridViewModel, DataViewModel, SaveOptions } from '../../../';

export const reactions: DataGridViewModel = {
  parent: 'recordable',
  label: 'Reactions',
  table: 'OcReaction',
  acl: 'authAny',
  ownerField: 'createdBy',
  fields: [
    { name: 'view', label: 'View', type: 'StringField' },
    { name: 'dataId', label: 'Data ID', type: 'StringField' },
    { name: 'reaction', label: 'Reaction', type: 'StringField' }
  ]
};

export const likeable: DataViewModel = {
  fields: [
    {
      name: 'likeCount',
      label: 'Like Count',
      type: 'NumberField',
      sql: ({ viewModel, knex }) =>
        knex
          .count()
          .from('OcReaction')
          .where('dataId', knex.raw('this.id'))
          .where('view', viewModel.name)
          .where('reaction', 'like')
    },
    {
      name: 'liked',
      label: 'Like by Me',
      type: 'NumberField',
      sql: ({ context, viewModel, knex }) =>
        knex
          .count()
          .from('OcReaction')
          .where('dataId', knex.raw('this.id'))
          .where('view', viewModel.name)
          .where('createdBy', context.user.id)
    }
  ],
  serverActions: [
    {
      name: 'toggleLike',
      label: 'Like ',
      icon: 'mdi-thumb-up',
      ellipsis: false,
      badgeValue: ({ selectedData }) => selectedData.likeCount,
      selected: ({ selectedData }) => selectedData.liked > 0,
      changeType: 'update',
      execute: async ({ data, registry: { dataService, authService }, view }) => {
        if (data.liked > 0) {
          const removeOptions: SaveOptions = {
            view: 'reactions',
            filter: { view: view, dataId: data.id, reaction: 'like', createdBy: authService.user.id }
          };

          await dataService.remove(removeOptions);
        } else {
          const saveOptions: SaveOptions = {
            view: 'reactions',
            data: { view: view, dataId: data.id, reaction: 'like' }
          };

          await dataService.save(saveOptions);
        }
      }
    }
  ]
};
