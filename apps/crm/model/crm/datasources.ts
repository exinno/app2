import { DatasourceModel } from 'app2-common';

const list: Array<DatasourceModel> = [
  {
    name: 'default',
    client: 'pg',
    connection: process.env.APP2_PG,
    options: {
      pool: { min: 5, max: 30 }
    }
  }
];

export default list;
