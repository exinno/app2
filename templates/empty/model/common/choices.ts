import { ChoiceModel } from 'app2-common';

const list: Array<ChoiceModel> = [
  {
    name: 'priority',
    choiceItems: [
      { value: 'low', label: 'Low' },
      { value: 'normal', label: 'Normal' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' }
    ]
  }
];

export default list;
