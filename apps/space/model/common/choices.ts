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
  },
  {
    name: 'status',
    choiceItems: [
      { value: 'open', label: 'Open' },
      { value: 'inProgress', label: 'In Progress' },
      { value: 'confirmation', label: 'Confirmation' },
      { value: 'complete', label: 'Complete' }
    ]
  },
  {
    name: 'taskType',
    choiceItems: [
      { value: 'question', label: 'Question' },
      { value: 'problem', label: 'Problem' },
      { value: 'incident', label: 'Incident' },
      { value: 'task', label: 'Task' },
      { value: 'suggestion', label: 'Suggestion' }
    ]
  },
  {
    name: 'postType',
    choiceItems: [
      { value: 'info', label: 'Information' },
      { value: 'news', label: 'News' },
      { value: 'article', label: 'Article' },
      { value: 'review', label: 'Review' },
      { value: 'tutorial', label: 'Tutorial' },
      { value: 'opinion', label: 'Opinion' }
    ]
  },
  {
    name: 'groupType',
    choiceItems: [
      { value: 'group', label: 'Group' },
      { value: 'space', label: 'Space' },
      { value: 'chatRoom', label: 'Chat Room' }
    ]
  },
  {
    name: 'spaceStatus',
    choiceItems: [
      { value: 'open', label: 'Open' },
      { value: 'archived', label: 'Archived' }
    ]
  },
  {
    name: 'spaceType',
    choiceItems: [
      {
        value: 'personal',
        label: 'Personal',
        icon: 'mdi-briefcase-account',
        description: 'Space that can only use for personal purpose',
        value1: 'ownerAny'
      },
      {
        value: 'private',
        label: 'Private',
        icon: 'mdi-key',
        description: 'Space that can only be join through invitation',
        value1: 'groupRead'
      },
      {
        value: 'normal',
        label: 'Normal',
        icon: 'mdi-door-closed',
        description: 'Space that can be searched and join',
        value1: 'authRead'
      },
      {
        value: 'public',
        label: 'Public',
        icon: 'mdi-door-open',
        description: 'Space that anyone can see',
        value1: 'authRead'
      }
    ]
  }
];

export default list;
