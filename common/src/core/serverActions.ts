import { ServerActionModel } from '../..';

const list: Array<ServerActionModel> = [
  {
    name: 'loadCsv',
    icon: 'mdi-database-import',
    actionType: 'multiple',
    // /api/data/views/loadCsv(view='aces')
    async execute({ registry: { dataService }, data, context }) {
      let message = '';
      if (data.view) data = [{ name: data.view }];
      for (const view of data) {
        const result = await dataService.loadCsv({ context, view: view.name });
        message += `${result} records loaded to ${view.name}. \n`;
      }
      return message;
    }
  }
];

export default list;
