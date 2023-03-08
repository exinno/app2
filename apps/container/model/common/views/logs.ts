import { LogViewModel } from '../..';

export const logs: LogViewModel = {
  type: 'LogView',
  label: 'App Log',
  width: '1000px',
  height: '100%',
  scrollToBottom: true,
  fields: [
    {
      name: 'logName',
      type: 'SelectField',
      cols: 4,
      optionItems: ({ registry: { httpClient }, dataId }) => httpClient.get(`logList/${dataId}`)
    }
  ],
  pageFields: ['logName'],
  paramFields: ['logName'],
  pageCtxDefaultData: ({ registry: { dayjs } }) => {
    return { logName: dayjs().format('YYYY-MM-DD') + '.log' };
  },
  data({ pageCtx, dataId, registry: { reactive } }) {
    if (!dataId || !pageCtx?.logName) return [];
    const nLines = pageCtx.nLines ?? 100;
    const logName = pageCtx.logName;
    this.eventSource?.close();
    this.eventSource = new EventSource(`/api/logs:live/${dataId}/${logName}?nLines=${nLines}`);
    const logs = reactive([]);
    this.eventSource.onmessage = ({ data }) => logs.push(data);
    return logs;
  },
  onUnmounted() {
    this.eventSource?.close();
  }
};
